import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StatCard as StatCardComponent } from '../components/stat-card/stat-card';
import { PanelCard } from '../components/panel-card/panel-card';
import { ActivityItem as ActivityItemComponent } from '../components/activity-item/activity-item';
import { ActivityItem, StatCard } from '../models/dashboard.models';

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, RouterLink, StatCardComponent, PanelCard, ActivityItemComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private readonly fb = inject(FormBuilder);

  protected readonly draftForm = this.fb.nonNullable.group({
    title: '',
    content: '',
  });

  // Static placeholder data — to be replaced by an API service later.
  protected readonly stats = signal<readonly StatCard[]>([
    { icon: 'visibility', label: 'Total Views', value: '2.4M', trend: '12.5%', trendDirection: 'up' },
    { icon: 'group', label: 'Subscribers', value: '148K', trend: '4.2%', trendDirection: 'up' },
    { icon: 'thumb_up', label: 'Avg. Engagement', value: '8.4%', trend: '1.1%', trendDirection: 'down' },
    { icon: 'payments', label: 'Est. Revenue', value: '$12,450', trend: '22.4%', trendDirection: 'up' },
  ]);

  protected readonly activity = signal<readonly ActivityItem[]>([
    {
      icon: 'publish',
      title: 'New post published:',
      text: '"The Future of Minimalist Design in Enterprise Software"',
      time: 'Just now',
      tone: 'primary',
    },
    {
      icon: 'forum',
      title: 'Sarah Jenkins',
      text: 'commented on your recent typography article.',
      time: '2 hours ago',
      tone: 'neutral',
    },
    {
      icon: 'error',
      title: 'System Alert:',
      text: 'Scheduled backup failed to complete. Please review logs.',
      time: '5 hours ago',
      tone: 'error',
    },
    {
      icon: 'group_add',
      title: 'Milestone Reached:',
      text: 'Gained 500 new subscribers this week.',
      time: '1 day ago',
      tone: 'neutral',
    },
  ]);

  protected saveDraft(): void {
    // Persistence wired up once the posts API service exists.
    this.draftForm.reset();
  }
}
