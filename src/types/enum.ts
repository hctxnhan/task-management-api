export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  POSTPONED = 'POSTPONED',
  CANCELED = 'CANCELED',
}

export enum TaskPriority {
  NONE = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  URGENT = 4,
}

export enum Weekday {
  MONDAY = 0,
  TUESDAY = 1,
  WEDNESDAY = 2,
  THURSDAY = 3,
  FRIDAY = 4,
  SATURDAY = 5,
  SUNDAY = 6,
}

export enum JoinGroupInvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum NotificationType {
  TASK_DUE = 'TASK_DUE',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  COMMENT_ON_TASK = 'COMMENT_ON_TASK',
  COMMENT_MENTION = 'COMMENT_MENTION',
  GROUP_JOIN_REQUEST = 'GROUP_JOIN_REQUEST',
  GROUP_JOIN_REQUEST_ACCEPTED = 'GROUP_JOIN_REQUEST_ACCEPTED',
  GROUP_JOIN_REQUEST_REJECTED = 'GROUP_JOIN_REQUEST_REJECTED',
}

export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}
