export interface Notification {
  id?: string;
  title: string;
  message: string;
  modal?: string;
  referenceId: string;
  accountId?: string;
  isOpen: boolean;
  isAdmin: boolean;
}