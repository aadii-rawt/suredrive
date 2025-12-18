"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const Shimmer = () => {
  const skeletons = Array.from({ length: 4 });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {skeletons.map((_, index) => (
        <Card key={index} className="h-full">
          <CardContent className="py-4 space-y-4 animate-pulse">
            {/* Title row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Checkbox placeholder */}
                <div className="h-4 w-4 rounded bg-muted" />

                {/* Title placeholder */}
                <div className="h-5 w-40 rounded bg-muted" />
              </div>

              {/* Status badge placeholder */}
              <div className="h-5 w-20 rounded-full bg-muted" />
            </div>

            {/* Description lines */}
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-3/4 rounded bg-muted" />
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2 pt-2">
              <div className="h-8 w-16 rounded bg-muted" />
              <div className="h-8 w-16 rounded bg-muted" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Shimmer;
