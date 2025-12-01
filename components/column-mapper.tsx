'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { detectColumnMapping, mapCSVToTransactions } from '@/lib/csv-parser';
import { ColumnMapping } from '@/lib/types';
import { Check, X } from 'lucide-react';

export function ColumnMapper() {
  const files = useStore((state) => state.files);
  const transactions = useStore((state) => state.transactions);
  const updateFileMapping = useStore((state) => state.updateFileMapping);
  const setTransactions = useStore((state) => state.setTransactions);
  const removeFile = useStore((state) => state.removeFile);

  const unmappedFiles = files.filter((f) => !f.mapping);

  if (unmappedFiles.length === 0 && files.length > 0) {
    return null;
  }

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {unmappedFiles.map((file) => (
        <FileMappingCard
          key={file.id}
          file={file}
          onConfirm={(mapping) => {
            updateFileMapping(file.id, mapping);
            // Recalculate all transactions
            const allTransactions = files
              .map((f) => {
                const m = f.id === file.id ? mapping : f.mapping;
                if (!m) return [];
                return mapCSVToTransactions(f, m);
              })
              .flat();
            setTransactions(allTransactions);
          }}
          onRemove={() => removeFile(file.id)}
        />
      ))}
    </div>
  );
}

function FileMappingCard({
  file,
  onConfirm,
  onRemove,
}: {
  file: any;
  onConfirm: (mapping: ColumnMapping) => void;
  onRemove: () => void;
}) {
  const [mapping, setMapping] = useState<ColumnMapping>(() => {
    return detectColumnMapping(file.headers);
  });

  const requiredFields: Array<keyof ColumnMapping> = ['date', 'isin', 'direction', 'quantity', 'price'];
  const isComplete = requiredFields.every((field) => mapping[field]);

  return (
    <Card className="border-primary/50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{file.name}</CardTitle>
            <CardDescription>
              {file.broker} • {file.data.length} rows
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Map the columns from your CSV file to the required fields:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['date', 'isin', 'direction', 'quantity', 'price', 'fees'] as const).map((field) => (
            <div key={field} className="space-y-2">
              <label className="text-sm font-medium capitalize flex items-center gap-2">
                {field}
                {!requiredFields.includes(field) && (
                  <span className="text-xs text-muted-foreground">(optional)</span>
                )}
              </label>
              <select
                value={mapping[field] || ''}
                onChange={(e) =>
                  setMapping((prev) => ({
                    ...prev,
                    [field]: e.target.value || undefined,
                  }))
                }
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">-- Select column --</option>
                {file.headers.map((header: string) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {file.data[0] && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <p className="text-sm font-medium mb-2">Preview (first row):</p>
            <div className="text-xs space-y-1 font-mono">
              {Object.entries(file.data[0]).slice(0, 5).map(([key, value]: [string, any]) => (
                <div key={key} className="flex gap-2">
                  <span className="text-muted-foreground">{key}:</span>
                  <span>{value?.toString() || 'N/A'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={() => onConfirm(mapping)}
          disabled={!isComplete}
          className="w-full"
        >
          <Check className="w-4 h-4 mr-2" />
          Confirm Mapping
        </Button>
      </CardContent>
    </Card>
  );
}
