export const NO_METRIC_DATA_MESSAGE = "No data found for this metric";

export function columnNotMappedMessage(columnLabel: string): string {
  return `${columnLabel} column was not mapped`;
}

export function unavailableHelperText(columnLabel: string): string {
  return `Unavailable because ${columnLabel.toLowerCase()} column was not mapped`;
}
