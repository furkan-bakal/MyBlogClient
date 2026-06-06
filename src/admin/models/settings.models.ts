/** Admin settings domain models. */

export interface UserProfile {
  readonly fullName: string;
  readonly email: string;
  /** Avatar URL. Null when no custom avatar is set. */
  readonly avatarUrl: string | null;
}

export interface PublicationDetails {
  readonly blogTitle: string;
  readonly metaDescription: string;
}

export interface Preferences {
  readonly darkMode: boolean;
  readonly pushNotifications: boolean;
  readonly weeklyDigest: boolean;
}
