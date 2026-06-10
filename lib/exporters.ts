import type { Agent } from "./agents";

export const EXPORT_FORMATS = ["lionclaw", "openclaw", "hermes"] as const;
export type ExportFormat = (typeof EXPORT_FORMATS)[number];

export interface ExportFile {
  filename: string;
  contentType: string;
  body: string;
}

/** The exported prompt = the expert's base prompt plus the captured workflow steps. */
function exportPrompt(agent: Agent): string {
  const steps = agent.workflow.map((s, i) => `${i + 1}. ${s}`).join("\n");
  return `${agent.systemPrompt}\n\nExpert workflow — follow these steps in order:\n${steps}`;
}

/**
 * Mirrors the Lionclaw agents/<name>/agent.json5 format. Credentials and
 * channels are stripped, and security/memory/backend are reset to the safe
 * Lionclaw baseline rather than copied from the source agent.
 */
function lionclawExport(agent: Agent): ExportFile {
  const config = {
    name: agent.id,
    description: agent.tagline,
    emoji: agent.emoji,
    model: agent.model,
    system_prompt: exportPrompt(agent),
    tools: agent.tools,
    subagents: [],
    builtin_subagents: ["ops"],
    skills: [],
    mcp_servers: agent.mcpServers.map((m) => ({
      url: m.url,
      transport: m.transport,
      enabled: m.enabled,
    })),
    channels: [],
    schedule: [],
    memory: {
      markdown: true,
      rag: false,
      rag_collection: `lionclaw_${agent.id}`,
      self_learning: true,
      self_learning_interval: 3600,
    },
    backend: { type: "local_shell", root_dir: "workspace" },
    security: { profile: "safe", trust_level: 2 },
    pulse: { enabled: true, in_tui: true },
  };
  return {
    filename: `${agent.id}.agent.json5`,
    contentType: "application/json5",
    body: JSON.stringify(config, null, 2) + "\n",
  };
}

function openclawExport(agent: Agent): ExportFile {
  const config = {
    version: 1,
    kind: "openclaw.agent",
    agent: {
      id: agent.id,
      name: agent.name,
      description: agent.tagline,
      model: agent.model,
      systemPrompt: exportPrompt(agent),
      tools: agent.tools,
      mcpServers: agent.mcpServers,
      memory: { enabled: true, selfLearning: true },
    },
    marketplace: {
      source: "clonemarket",
      creator: agent.creator.name,
      exportedFor: "openclaw",
    },
  };
  return {
    filename: `${agent.id}.openclaw.json`,
    contentType: "application/json",
    body: JSON.stringify(config, null, 2) + "\n",
  };
}

function yamlMultiline(text: string, indent: string): string {
  return text
    .split("\n")
    .map((line) => `${indent}${line}`)
    .join("\n");
}

function hermesExport(agent: Agent): ExportFile {
  // JSON.stringify everywhere: JSON strings are valid YAML double-quoted
  // scalars, which keeps colons/quotes/indicators in values from breaking
  // the manifest.
  const tools =
    agent.tools.length > 0
      ? agent.tools.map((t) => `    - ${JSON.stringify(t)}`).join("\n")
      : "    []";
  const mcp =
    agent.mcpServers.length > 0
      ? agent.mcpServers
          .map(
            (m) =>
              `    - url: ${JSON.stringify(m.url)}\n      transport: ${JSON.stringify(m.transport)}\n      enabled: ${m.enabled}`,
          )
          .join("\n")
      : "    []";
  const body = `# Hermes agent manifest — exported from CloneMarket
apiVersion: hermes/v1
kind: Agent
metadata:
  name: ${JSON.stringify(agent.id)}
  displayName: ${JSON.stringify(agent.name)}
  description: ${JSON.stringify(agent.tagline)}
  creator: ${JSON.stringify(agent.creator.name)}
spec:
  model: ${JSON.stringify(agent.model)}
  systemPrompt: |
${yamlMultiline(exportPrompt(agent), "    ")}
  tools:
${tools}
  mcpServers:
${mcp}
  memory:
    selfLearning: true
    intervalSeconds: 3600
`;
  return {
    filename: `${agent.id}.hermes.yaml`,
    contentType: "application/yaml",
    body,
  };
}

export function buildExport(agent: Agent, format: ExportFormat): ExportFile {
  switch (format) {
    case "lionclaw":
      return lionclawExport(agent);
    case "openclaw":
      return openclawExport(agent);
    case "hermes":
      return hermesExport(agent);
  }
}
