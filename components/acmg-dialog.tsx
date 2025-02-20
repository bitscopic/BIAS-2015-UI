"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import type { Variant } from "../types/variants";
import type { ReactNode } from "react";

interface ACMGDialogProps {
  variant: Variant;
  children: ReactNode;
  onSave: (updatedVariant: Variant) => void;
}

// All possible ACMG codes with their groups
const CRITERIA_INFO = {
  pvs1: {
    group: "pvs",
    title: "Very Strong Evidence of Pathogenicity",
    color: "bg-red-100",
  },
  ps1: {
    group: "ps",
    title: "Strong Evidence of Pathogenicity",
    color: "bg-orange-100",
  },
  ps2: {
    group: "ps",
    title: "Strong Evidence of Pathogenicity",
    color: "bg-orange-100",
  },
  ps3: {
    group: "ps",
    title: "Strong Evidence of Pathogenicity",
    color: "bg-orange-100",
  },
  ps4: {
    group: "ps",
    title: "Strong Evidence of Pathogenicity",
    color: "bg-orange-100",
  },
  pm1: {
    group: "pm",
    title: "Moderate Evidence of Pathogenicity",
    color: "bg-yellow-100",
  },
  pm2: {
    group: "pm",
    title: "Moderate Evidence of Pathogenicity",
    color: "bg-yellow-100",
  },
  pm3: {
    group: "pm",
    title: "Moderate Evidence of Pathogenicity",
    color: "bg-yellow-100",
  },
  pm4: {
    group: "pm",
    title: "Moderate Evidence of Pathogenicity",
    color: "bg-yellow-100",
  },
  pm5: {
    group: "pm",
    title: "Moderate Evidence of Pathogenicity",
    color: "bg-yellow-100",
  },
  pm6: {
    group: "pm",
    title: "Moderate Evidence of Pathogenicity",
    color: "bg-yellow-100",
  },
  pp1: {
    group: "pp",
    title: "Supporting Evidence of Pathogenicity",
    color: "bg-yellow-50",
  },
  pp2: {
    group: "pp",
    title: "Supporting Evidence of Pathogenicity",
    color: "bg-yellow-50",
  },
  pp3: {
    group: "pp",
    title: "Supporting Evidence of Pathogenicity",
    color: "bg-yellow-50",
  },
  pp4: {
    group: "pp",
    title: "Supporting Evidence of Pathogenicity",
    color: "bg-yellow-50",
  },
  pp5: {
    group: "pp",
    title: "Supporting Evidence of Pathogenicity",
    color: "bg-yellow-50",
  },
  ba1: {
    group: "ba",
    title: "Stand-Alone Evidence of Benign Impact",
    color: "bg-green-100",
  },
  bs1: {
    group: "bs",
    title: "Strong Evidence of Benign Impact",
    color: "bg-green-200",
  },
  bs2: {
    group: "bs",
    title: "Strong Evidence of Benign Impact",
    color: "bg-green-200",
  },
  bs3: {
    group: "bs",
    title: "Strong Evidence of Benign Impact",
    color: "bg-green-200",
  },
  bs4: {
    group: "bs",
    title: "Strong Evidence of Benign Impact",
    color: "bg-green-200",
  },
  bp1: {
    group: "bp",
    title: "Supporting Evidence of Benign Impact",
    color: "bg-green-50",
  },
  bp2: {
    group: "bp",
    title: "Supporting Evidence of Benign Impact",
    color: "bg-green-50",
  },
  bp3: {
    group: "bp",
    title: "Supporting Evidence of Benign Impact",
    color: "bg-green-50",
  },
  bp4: {
    group: "bp",
    title: "Supporting Evidence of Benign Impact",
    color: "bg-green-50",
  },
  bp5: {
    group: "bp",
    title: "Supporting Evidence of Benign Impact",
    color: "bg-green-50",
  },
  bp6: {
    group: "bp",
    title: "Supporting Evidence of Benign Impact",
    color: "bg-green-50",
  },
  bp7: {
    group: "bp",
    title: "Supporting Evidence of Benign Impact",
    color: "bg-green-50",
  },
} as const;

export function ACMGDialog({ variant, children, onSave }: ACMGDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editedVariant, setEditedVariant] = useState<Variant>(() =>
    JSON.parse(JSON.stringify(variant))
  );

  const handleSave = () => {
    onSave(editedVariant);
    setIsOpen(false);
  };

  const updateCriteria = (
    group: string,
    code: string,
    field: "score" | "description",
    value: number | string
  ) => {
    setEditedVariant((prev) => {
      const newVariant = { ...prev };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(newVariant.rationale as any)[group][code]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (newVariant.rationale as any)[group][code] = [0, ""];
      }

      const index = field === "score" ? 0 : 1;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (newVariant.rationale as any)[group][code][index] = value;
      return newVariant;
    });
  };

  const removeCriteria = (group: string, code: string) => {
    setEditedVariant((prev) => {
      const newVariant = { ...prev };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (newVariant.rationale as any)[group][code];
      return newVariant;
    });
  };

  // Group all criteria by their type (pathogenic vs benign) and strength
  const groupedCriteria = Object.entries(CRITERIA_INFO).reduce(
    (acc, [code, info]) => {
      if (!acc[info.title]) {
        acc[info.title] = [];
      }
      const values = editedVariant.rationale[info.group][code] || [0, ""];
      acc[info.title].push({ code, info, values });
      return acc;
    },
    {} as Record<
      string,
      Array<{
        code: string;
        info: (typeof CRITERIA_INFO)[keyof typeof CRITERIA_INFO];
        values: [number, string];
      }>
    >
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ACMG Classification Details</DialogTitle>
          <DialogDescription>
            Variant: {variant.geneName} {variant.hgvsc}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* All Criteria Groups */}
          {Object.entries(groupedCriteria).map(([title, criteria]) => (
            <div key={title} className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground">
                {title}
              </h3>
              <div className="grid gap-4">
                {criteria.map(
                  ({ code, info, values: [score, description] }) => (
                    <div key={code} className={`rounded-lg p-4 ${info.color}`}>
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className=" items-center gap-2 mb-2">
                            <div className="font-bold text-lg">
                              {code.toUpperCase()}
                            </div>
                            <div>
                              <div className="flex direction-col items-center gap-2">
                                <span className="font-medium">Score:</span>
                                <Select
                                  value={score.toString()}
                                  onValueChange={(value) =>
                                    updateCriteria(
                                      info.group,
                                      code,
                                      "score",
                                      Number.parseInt(value)
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-20">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[0, 1, 2, 3, 4, 5].map((value) => (
                                      <SelectItem
                                        key={value}
                                        value={value.toString()}
                                      >
                                        {value}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                          <Textarea
                            value={description}
                            onChange={(e) =>
                              updateCriteria(
                                info.group,
                                code,
                                "description",
                                e.target.value
                              )
                            }
                            className="min-h-[60px]"
                            placeholder="Enter evidence details..."
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCriteria(info.group, code)}
                          className="opacity-50 hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {" "}
            {/* TODO: needs to reset form contents... clicking X apperas to accomplish this? */}
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

