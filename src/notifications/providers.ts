export type NotificationMessage = {
  title: string;
  currentPrice: number;
  targetPrice: number;
  platform: string;
  url: string;
  timestamp: Date;
};

export interface NotificationProvider {
  channel: "TELEGRAM" | "EMAIL";
  send(message: NotificationMessage): Promise<{ status: "sent" | "failed"; reason?: string }>;
}

export class TelegramProvider implements NotificationProvider {
  channel = "TELEGRAM" as const;

  async send(): Promise<{ status: "sent" | "failed"; reason?: string }> {
    return { status: "sent" };
  }
}

export class EmailProvider implements NotificationProvider {
  channel = "EMAIL" as const;

  async send(): Promise<{ status: "sent" | "failed"; reason?: string }> {
    return { status: "sent" };
  }
}

export const notificationProviders: NotificationProvider[] = [new TelegramProvider(), new EmailProvider()];
