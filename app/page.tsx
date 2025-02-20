"use client";

import { useState } from "react";
import { VariantTable } from "../components/variant-table";
import { FileUpload } from "../components/file-upload";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { Variant } from "@/types/variants";

// Sample data
const sampleData: Variant[] = [
  {
    chromosome: "chr1",
    position: 11169679,
    refAllele: "G",
    altAllele: "T",
    variantType: "SNV",
    consequence: "intron_variant",
    acmgClassification: "benign",
    alleleFreq: 0.0016,
    hgvsg: "NC_000001.10:g.11169679G>T",
    hgvsc: "NM_004958.3:c.7447 27C>A",
    hgvsp: "n/a",
    aaChange: "n/a",
    geneName: "MTOR",
    pubmedIds: [],
    associatedDiseases: [
      "overgrowth syndrome and/or cerebral malformations due to abnormalities in MTOR pathway genes",
    ],
    dbSnpid: "rs369718641",
    transcript: "NM_004958.3",
    rationale: {
      pvs: { pvs1: [0, "intron_variant is not a LoF consequence"] },
      ps: {
        ps1: [0, ""],
        ps2: [0, ""],
        ps3: [0, ""],
        ps4: [
          1,
          "PS4_supporting: No GWAS data found. TOPMed AF=0.00160% indicates rarity consistent with pathogenicity.",
        ],
      },
      pm: {
        pm1: [0, ""],
        pm2: [
          3,
          "PM2: gnomAD 0.00110% is below LOEUF-based threshold 0.02500%.",
        ],
        pm3: [0, ""],
        pm4: [0, ""],
        pm5: [0, ""],
        pm6: [0, ""],
      },
      pp: {
        pp1: [0, ""],
        pp2: [0, ""],
        pp3: [0, ""],
        pp4: [0, ""],
        pp5: [0, ""],
      },
      ba: { ba1: [0, ""] },
      bs: { bs1: [0, ""], bs2: [0, ""], bs3: [0, ""], bs4: [0, ""] },
      bp: {
        bp1: [0, ""],
        bp2: [0, ""],
        bp3: [0, ""],
        bp4: [
          1,
          "BP4: 2 line(s) of computational evidence support a benign effect; supporting phylop 0.7 | supporting gerp 1.95",
        ],
        bp5: [0, ""],
        bp6: [
          5,
          "BP6_stand-alone: Variant was found in ClinVar as likely benign with review status of reviewed by expert panel and given a weighted PP5 value of 5",
        ],
        bp7: [
          1,
          "BP7: Variant has intronic associated consequence intron_variant with ABSplice score None",
        ],
      },
    },
  },
];

export default function VariantsPage() {
  const [variants, setVariants] = useState<Variant[]>(sampleData);

  const handleFileUpload = (data: Variant[]) => {
    setVariants(data);
  };

  const handleVariantUpdate = (updatedVariant: Variant) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.hgvsc === updatedVariant.hgvsc ? updatedVariant : variant
      )
    );
  };

  const handleDownloadModified = () => {
    // Convert variants to TSV
    const headers = [
      "chromosome",
      "position",
      "refAllele",
      "altAllele",
      "variantType",
      "consequence",
      "acmgClassification",
      "alleleFreq",
      "hgvsg",
      "hgvsc",
      "hgvsp",
      "aaChange",
      "geneName",
      "pubmedIds",
      "associatedDiseases",
      "dbSnpid",
      "transcript",
      "rationale",
    ];

    const rows = variants.map((variant) => {
      return headers
        .map((header) => {
          const value = variant[header as keyof Variant];
          if (Array.isArray(value)) {
            return value.join(",");
          }
          if (typeof value === "object") {
            return JSON.stringify(value);
          }
          return value;
        })
        .join("\t");
    });

    const tsv = [headers.join("\t"), ...rows].join("\n");
    const blob = new Blob([tsv], { type: "text/tab-separated-values" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "variants-modified.tsv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadTemplate = () => {
    // Convert sample data to TSV
    const headers = [
      "chromosome",
      "position",
      "refAllele",
      "altAllele",
      "variantType",
      "consequence",
      "acmgClassification",
      "alleleFreq",
      "hgvsg",
      "hgvsc",
      "hgvsp",
      "aaChange",
      "geneName",
      "pubmedIds",
      "associatedDiseases",
      "dbSnpid",
      "transcript",
      "rationale",
    ];

    const rows = sampleData.map((variant) => {
      return headers
        .map((header) => {
          const value = variant[header as keyof Variant];
          if (Array.isArray(value)) {
            return value.join(",");
          }
          if (typeof value === "object") {
            return JSON.stringify(value);
          }
          return value;
        })
        .join("\t");
    });

    const tsv = [headers.join("\t"), ...rows].join("\n");
    const blob = new Blob([tsv], { type: "text/tab-separated-values" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "variant-template.tsv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Genomic Variants Browser</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadModified}>
            <Download className="w-4 h-4 mr-2" />
            Download Modified File
          </Button>
          <Button variant="outline" onClick={handleDownloadTemplate}>
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
          <FileUpload onUpload={handleFileUpload}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Variants
          </FileUpload>
        </div>
      </div>
      <VariantTable variants={variants} onVariantUpdate={handleVariantUpdate} />
    </div>
  );
}

