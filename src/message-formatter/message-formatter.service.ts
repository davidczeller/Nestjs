export class MessageFormatterService {
  format(message: string): string {
    const formattedDate = new Date().toISOString();
    return `[${formattedDate}] ${message}`;
  }
}
