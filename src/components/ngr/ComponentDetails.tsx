"use client";

import { CodeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { RegistryItem } from "shadcn/registry";

import ComponentCli from "@/src/components/ngr/cli-commands";
import CodeBlock from "@/src/components/ngr/code-block";
import CopyButton from "@/src/components/ngr/copy-button";
import CopyRegistry from "@/src/components/ngr/copy-registry";
import OpenInV0 from "@/src/components/ngr/open-in-v0";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { convertRegistryPaths } from "@/src/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { BASE_URL } from "@/src/lib/secret";

export default function ComponentDetails({
  component,
}: {
  component: { name: string };
}) {
  const [code, setCode] = useState<string | null>(null);
  const [exampleCode, setExampleCode] = useState<string[]>([]);
  useEffect(() => {
    const handleEmptyCode = () => {
      setCode("");
    };

    const loadCode = async () => {
      try {
        const response = await fetch(`/r/${component.name}.json`);
        if (!response.ok) {
          handleEmptyCode();
          return;
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          handleEmptyCode();
          return;
        }

        const data: RegistryItem = await response.json();
        const files = data.files?.length ? data.files : [];
        if (files.length) {
          const codeContent = files[0]?.content
            ? convertRegistryPaths(files[0]?.content)
            : "";
          setCode(codeContent);
          if (files.length > 1) {
            for (const file of files.splice(1)) {
              const codeExampleContent =
                file?.content && convertRegistryPaths(file?.content);
              if (codeExampleContent)
                setExampleCode((prev) => [...prev, codeExampleContent]);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load code:", error);
        handleEmptyCode();
      }
    };

    loadCode();
  }, [component.name]);
  console.log(exampleCode);
  return (
    <div className="absolute bottom-2 right-4 flex gap-1 peer-data-comp-loading:hidden">
      <CopyRegistry
        url={`${BASE_URL}/r/${component.name}.json`}
      />
      <OpenInV0
        componentSource={`${BASE_URL}/r/${component.name}.json`}
      />
      <Dialog>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground/80 hover:text-foreground transition-none hover:bg-transparent disabled:opacity-100  lg:group-focus-within/item:opacity-100 lg:group-hover/item:opacity-100"
                  >
                    <CodeIcon size={16} aria-hidden={true} />
                  </Button>
                </DialogTrigger>
              </span>
            </TooltipTrigger>
            <TooltipContent className="text-muted-foreground px-2 py-1 text-xs">
              View code
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent className="sm:max-w-[600px] py-8">
          <DialogHeader>
            <DialogTitle className="text-left">Installation</DialogTitle>
            <DialogDescription className="sr-only">
              Use the CLI to add components to your project
            </DialogDescription>
          </DialogHeader>
          <div className="min-w-0 space-y-5">
            <ComponentCli name={component.name} />
            <div className="space-y-4">
              <Tabs defaultValue="code">
                <TabsList>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  {exampleCode.length > 0 &&
                    exampleCode.map((_, idx) => (
                      <TabsTrigger key={idx} value={`example-${idx}`}>
                        Example {idx + 1}
                      </TabsTrigger>
                    ))}
                </TabsList>
                <TabsContent value="code">
                  <div className="relative">
                    {code === "" ? (
                      <p className="text-muted-foreground text-sm">
                        No code available. If you think this is an error, please
                        <a
                          href="https://github.com/ngr-ui/issues"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground font-medium underline hover:no-underline"
                        >
                          open an issue
                        </a>
                        .
                      </p>
                    ) : (
                      <>
                        <CodeBlock code={code} lang="tsx" />
                        <CopyButton componentSource={code} />
                      </>
                    )}
                  </div>
                </TabsContent>
                {exampleCode.length > 0 &&
                  exampleCode.map((code, idx) => (
                    <TabsContent key={idx} value={`example-${idx}`}>
                      <div className="overflow-y-scroll overscroll-y-contain max-h-[60dvh]">
                        <div className="space-y-4 mt-4">
                          <p className="text-lg font-semibold tracking-tight">
                            Example {idx + 1}
                          </p>
                          <div className="relative space-y-8 ">
                               <ExampleCode code={code} key={idx} />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ExampleCode({ code }: { code: string }) {
  return (
    <>
      <CodeBlock code={code} lang="tsx" />
      <CopyButton componentSource={code} />
    </>
  );
}
