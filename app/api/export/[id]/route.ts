import type { NextRequest } from "next/server";
import { getAgent } from "@/lib/agents";
import {
  buildExport,
  EXPORT_FORMATS,
  type ExportFormat,
} from "@/lib/exporters";

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

  const file = buildExport(agent, format as ExportFormat);
  return new Response(file.body, {
    headers: {
      "Content-Type": `${file.contentType}; charset=utf-8`,
      "Content-Disposition": `attachment; filename="${file.filename}"`,
    },
  });
}
