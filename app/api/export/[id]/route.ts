import { randomBytes } from "crypto";
import type { NextRequest } from "next/server";
import { getAgent } from "@/lib/agents";
import {
  buildExport,
  EXPORT_FORMATS,
  type ExportFormat,
  type License,
} from "@/lib/exporters";

/** Mint a unique, traceable license stamp for this download. */
function mintLicense(agentId: string, licensedTo: string): License {
  const token = randomBytes(3).toString("hex").toUpperCase();
  return {
    id: `PM-${agentId.toUpperCase()}-${token}`,
    licensedTo,
    issued: new Date().toISOString().slice(0, 10),
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const agent = getAgent(id);
  if (!agent) {
    return Response.json({ error: "Unknown agent" }, { status: 404 });
  }

  const format = request.nextUrl.searchParams.get("format") ?? "lionclaw";
  if (!EXPORT_FORMATS.includes(format as ExportFormat)) {
    return Response.json(
      { error: `format must be one of: ${EXPORT_FORMATS.join(", ")}` },
      { status: 400 },
    );
  }

  // In production the buyer identity comes from the authenticated session; for
  // the demo we accept a hint from the client and fall back to a label.
  const licensedTo =
    request.nextUrl.searchParams.get("buyer")?.slice(0, 64) ||
    "Project Mural licensee";
  const license = mintLicense(agent.id, licensedTo);

  const file = buildExport(agent, format as ExportFormat, license);
  return new Response(file.body, {
    headers: {
      "Content-Type": `${file.contentType}; charset=utf-8`,
      "Content-Disposition": `attachment; filename="${file.filename}"`,
      // Unique per download; never cache a licensed artifact.
      "Cache-Control": "no-store",
    },
  });
}
