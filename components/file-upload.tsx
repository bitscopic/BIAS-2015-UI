import { Button } from "@/components/ui/button";
import type { Variant } from "../types/variants";
import { type ReactNode, useRef, type ChangeEvent } from "react";

interface FileUploadProps {
  onUpload: (data: Variant[]) => void;
  children: ReactNode;
}

function parseTSV(text: string): Variant[] {
  const lines = text.trim().split("\n");
  const headers = lines[0].split("\t");

  return lines.slice(1).map((line) => {
    const values = line.split("\t");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entry: any = {};

    headers.forEach((header, index) => {
      const value = values[index];

      // Parse specific fields
      switch (header) {
        case "position":
          entry[header] = Number.parseInt(value);
          break;
        case "alleleFreq":
          entry[header] = Number.parseFloat(value);
          break;
        case "rationale":
          try {
            entry[header] = JSON.parse(value);
          } catch (e) {
            console.warn("Could not parse rationale JSON:", e);
            entry[header] = {}; // Provide empty default
          }
          break;
        case "pubmedIds":
        case "associatedDiseases":
          entry[header] = value ? value.split(",").map((v) => v.trim()) : [];
          break;
        default:
          entry[header] = value;
      }
    });

    // Ensure required fields exist
    const variant: Variant = {
      chromosome: entry.chromosome || "",
      position: entry.position || 0,
      refAllele: entry.refAllele || "",
      altAllele: entry.altAllele || "",
      variantType: entry.variantType || "",
      consequence: entry.consequence || "",
      acmgClassification: entry.acmgClassification || "unknown",
      alleleFreq: entry.alleleFreq || 0,
      hgvsg: entry.hgvsg || "",
      hgvsc: entry.hgvsc || "",
      hgvsp: entry.hgvsp || "",
      aaChange: entry.aaChange || "",
      geneName: entry.geneName || "",
      pubmedIds: entry.pubmedIds || [],
      associatedDiseases: entry.associatedDiseases || [],
      dbSnpid: entry.dbSnpid || "",
      transcript: entry.transcript || "",
      rationale: entry.rationale || {
        pvs: {},
        ps: {},
        pm: {},
        pp: {},
        ba: {},
        bs: {},
        bp: {},
      },
    };

    return variant;
  });
}

export function FileUpload({ onUpload, children }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const variants = parseTSV(text);
        onUpload(variants);
      } catch (error) {
        console.error("Error parsing TSV file:", error);
        alert("Error parsing TSV file. Please ensure it's properly formatted.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <input
        type="file"
        accept=".tsv,.txt"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      <Button variant="default" onClick={() => fileInputRef.current?.click()}>
        {children}
      </Button>
    </>
  );
}

