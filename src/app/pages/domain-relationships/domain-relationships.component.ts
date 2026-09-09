import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomainService } from '../../services/domain.service';
import { Domain } from '../../models/domain';

interface DiagramNode { domain: Domain; x: number; y: number; }
interface DiagramEdge { from: DiagramNode; to: DiagramNode; }

@Component({
  selector: 'app-domain-relationships',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './domain-relationships.component.html',
})
export class DomainRelationshipsComponent implements OnInit {
  private readonly service = inject(DomainService);
  domains: Domain[] = [];
  nodes: DiagramNode[] = [];
  edges: DiagramEdge[] = [];
  canvasWidth = 760;
  canvasHeight = 420;
  zoom = 1;
  loading = true;
  error = '';
  private draggingNode?: DiagramNode;
  private dragOffset = { x: 0, y: 0 };
  private panning = false;
  private panStart = { x: 0, y: 0, scrollLeft: 0, scrollTop: 0 };

  ngOnInit(): void {
    this.service.list().subscribe({
      next: (domains) => { this.domains = domains; this.buildDiagram(); this.loading = false; },
      error: () => { this.error = 'Unable to load domain relationships.'; this.loading = false; },
    });
  }

  private buildDiagram(spaced = false): void {
    const columns = Math.max(1, Math.ceil(Math.sqrt(this.domains.length)));
    const nodeWidth = 220;
    const columnGap = spaced ? 120 : 40;
    const nodeHeight = 82;
    const rowGap = spaced ? 110 : 58;
    const horizontalPadding = spaced ? 48 : 32;
    const verticalPadding = spaced ? 48 : 32;
    const rows = Math.ceil(this.domains.length / columns);

    this.canvasWidth = Math.max(spaced ? 900 : 760, horizontalPadding * 2 + columns * nodeWidth + (columns - 1) * columnGap);
    this.canvasHeight = Math.max(spaced ? 520 : 420, verticalPadding * 2 + rows * nodeHeight + (rows - 1) * rowGap);
    this.nodes = this.domains.map((domain, index) => ({
      domain,
      x: horizontalPadding + (index % columns) * (nodeWidth + columnGap),
      y: verticalPadding + Math.floor(index / columns) * (nodeHeight + rowGap),
    }));

    const byId = new Map(this.nodes.map((node) => [node.domain.id, node]));
    const seen = new Set<string>();
    this.edges = [];
    for (const node of this.nodes) {
      for (const related of node.domain.relatedDomains ?? []) {
        const target = byId.get(related.id);
        if (!target || target.domain.id === undefined || node.domain.id === undefined) continue;
        const key = [node.domain.id, target.domain.id].sort((a, b) => a - b).join('-');
        if (!seen.has(key)) { seen.add(key); this.edges.push({ from: node, to: target }); }
      }
    }
  }

  reorganize(): void {
    this.buildDiagram(true);
  }

  zoomOut(): void { this.zoom = Math.max(0.6, Number((this.zoom - 0.1).toFixed(1))); }

  zoomIn(): void { this.zoom = Math.min(2, Number((this.zoom + 0.1).toFixed(1))); }

  startNodeDrag(event: PointerEvent, node: DiagramNode): void {
    event.stopPropagation();
    const point = this.svgPoint(event);
    this.draggingNode = node;
    this.dragOffset = { x: point.x - node.x, y: point.y - node.y };
    (event.currentTarget as SVGElement).setPointerCapture(event.pointerId);
  }

  startPan(event: PointerEvent, viewport: HTMLElement): void {
    if (this.draggingNode) return;
    this.panning = true;
    this.panStart = { x: event.clientX, y: event.clientY, scrollLeft: viewport.scrollLeft, scrollTop: viewport.scrollTop };
    viewport.setPointerCapture(event.pointerId);
  }

  movePointer(event: PointerEvent, viewport: HTMLElement): void {
    if (this.draggingNode) {
      const point = this.svgPoint(event);
      this.draggingNode.x = Math.max(8, Math.min(this.canvasWidth - 228, point.x - this.dragOffset.x));
      this.draggingNode.y = Math.max(8, Math.min(this.canvasHeight - 90, point.y - this.dragOffset.y));
    } else if (this.panning) {
      viewport.scrollLeft = this.panStart.scrollLeft - (event.clientX - this.panStart.x);
      viewport.scrollTop = this.panStart.scrollTop - (event.clientY - this.panStart.y);
    }
  }

  endPointer(): void { this.draggingNode = undefined; this.panning = false; }

  private svgPoint(event: PointerEvent): { x: number; y: number } {
    const target = event.currentTarget;
    const svg = target instanceof SVGElement
      ? target.ownerSVGElement ?? (target as SVGSVGElement)
      : (target as HTMLElement | null)?.querySelector('svg');
    if (!(svg instanceof SVGSVGElement)) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * this.canvasWidth / rect.width, y: (event.clientY - rect.top) * this.canvasHeight / rect.height };
  }
}
