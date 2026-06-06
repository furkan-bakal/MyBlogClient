import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface Comment {
  readonly id: string;
  readonly authorName: string;
  readonly authorInitials: string;
  readonly body: string;
  readonly timeAgo: string;
  readonly likeCount: number;
}

/** Renders a single comment row with like and reply actions. */
@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.html',
  styleUrl: './comment-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentItem {
  readonly comment = input.required<Comment>();
  readonly replyClicked = output<string>();

  protected onReply(): void {
    this.replyClicked.emit(this.comment().id);
  }
}
