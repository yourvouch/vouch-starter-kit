export type TelemetryEvent =
  | "sample_opened" | "personal_data_started" | "mapping_completed" | "review_saved"
  | "action_created" | "second_review_saved" | "export_used" | "sanitized_card_created"
  | "github_link_clicked" | "pack_documentation_opened";

export interface TelemetryAdapter {
  enabled: boolean;
  track(event: TelemetryEvent, properties?: Record<string, string | number | boolean>): void;
}

const prohibitedKey = /file|name|email|phone|contact|value|amount|row|field/i;
export function safeTelemetryProperties(properties: Record<string, string | number | boolean> = {}) {
  return Object.fromEntries(Object.entries(properties).filter(([key]) => !prohibitedKey.test(key)));
}

export const telemetry: TelemetryAdapter = {
  enabled: false,
  track() {},
};

export function createDevelopmentTelemetry(enabled = false): TelemetryAdapter & { events: Array<{ event: TelemetryEvent; properties: Record<string, string | number | boolean> }> } {
  const events: Array<{ event: TelemetryEvent; properties: Record<string, string | number | boolean> }> = [];
  return {
    enabled,
    events,
    track(event, properties = {}) {
      if (enabled) events.push({ event, properties: safeTelemetryProperties(properties) });
    },
  };
}
