import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  protected readonly productId = signal<string | null>(null);
  private sub?: Subscription;

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    // Snapshot approach
    const snapshotId = this.route.snapshot.paramMap.get('id');
    if (snapshotId) {
      this.productId.set(snapshotId);
    }

    // Observable approach
    this.sub = this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.productId.set(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
