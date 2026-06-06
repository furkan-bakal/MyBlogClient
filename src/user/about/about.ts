import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

export interface TimelineEntry {
  readonly period: string;
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
}

export interface PortfolioItem {
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
}

type PortfolioFilter = 'Web' | 'Print' | 'Strategy';

/**
 * Author resume and portfolio page.
 * Data is static since the API has no profile/portfolio endpoints.
 */
@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  protected readonly activeFilter = signal<PortfolioFilter>('Web');

  protected readonly timeline = signal<TimelineEntry[]>([
    {
      period: '2021 — PRESENT',
      title: 'Chief Editor — Global Digital Insights',
      description:
        'Directing a cross-functional team of 25 writers and designers. Scaled monthly organic traffic from 2M to 12M unique visitors through AI-driven content optimization.',
      tags: ['Strategic Planning', 'Team Leadership', 'SEO Performance'],
    },
    {
      period: '2018 — 2021',
      title: 'Senior Content Strategist — TechFlow Media',
      description:
        'Led the digital transformation of a legacy print magazine. Developed a proprietary content management workflow that reduced production time by 40%.',
      tags: ['CMS Architecture', 'Process Design'],
    },
    {
      period: '2015 — 2018',
      title: 'Editorial Lead — Venture Beats',
      description:
        'Managed the daily output of the Fintech vertical. Awarded "Editor of the Year" in 2017 for exceptional investigative series on blockchain adoption.',
      tags: ['Investigative Journalism', 'Data Visualization'],
    },
  ]);

  protected readonly allPortfolio: readonly PortfolioItem[] = [
    {
      title: 'Editorial Engine Dashboard',
      description:
        'A custom-built internal analytics tool designed specifically for newsroom editors to track article performance in real-time.',
      tags: ['React', 'D3.js', 'Design Ops'],
    },
    {
      title: 'Pulse Quarterly Digital',
      description:
        'Complete digital redesign for Pulse Quarterly, focusing on readability, typography, and premium user experience.',
      tags: ['Visual Identity', 'Figma', 'Typography'],
    },
    {
      title: 'Global Content Blueprint',
      description:
        'A comprehensive content strategy framework implemented across 14 international satellite offices.',
      tags: ['Strategy', 'Scale', 'Governance'],
    },
  ];

  protected readonly portfolioItems = signal(this.allPortfolio);

  protected setFilter(filter: string): void {
    this.activeFilter.set(filter as PortfolioFilter);
    // Filter is cosmetic for now; a real backend would filter by category.
    this.portfolioItems.set(this.allPortfolio);
  }
}
