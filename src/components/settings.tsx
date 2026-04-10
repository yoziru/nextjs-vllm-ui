
"use client";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import ClearChatsButton from "./settings-clear-chats";
import SettingsThemeToggle from "./settings-theme-toggle";
import SystemPrompt, { SystemPromptProps } from "./system-prompt";
import Accordion from "./ui/Accordion";

export default function SettingsContainer({ chatOptions, setChatOptions }: SystemPromptProps) {
  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 m-0">
      <div className="border border-transparent rounded-lg p-0.5 m-0">

        <SystemPrompt chatOptions={chatOptions} setChatOptions={setChatOptions} />

        <div className="accordion accordion-flush p-0 m-0" id="accordionFlushExample">
          <Accordion title="Settings">
            {/* Temperature */}
            <div className="flex items-center gap-4 p-0 m-0">
              <label className="text-sm font-medium w-1/3 p-0 m-0">Temperature</label>
              <div className="flex items-center justify-end w-2/3 p-0 m-0">
                <Button
                  onClick={() => setChatOptions({ ...chatOptions, temperature: 0 })}
                  variant="ghost"
                  size="iconSm"
                  className="text-gray-500 hover:text-gray-700 p-0 m-0 mr-[-1px]"
                >
                  <Trash2 className="w-4 h-4 p-0 m-0" />
                </Button>
                <Input
                  type="number"
                  value={chatOptions.temperature}
                  onChange={(e) => {
                    const val = e.target.value;

                    // Reset if input is longer than 3 characters (e.g., "1.25")
                    if (val.length > 3) {
                      setChatOptions({ ...chatOptions, temperature: 0 });
                      return;
                    }
                    const parsed = parseFloat(val);
                    if (!isNaN(parsed) && parsed > 2) {
                      setChatOptions({ ...chatOptions, temperature: 0 });
                      return;
                    }
                    if (!isNaN(parsed) && parsed >= 0) {
                      setChatOptions({ ...chatOptions, temperature: parsed });
                    }
                  }}
                  min={0}
                  max={2}
                  step={0.1}
                  className="w-16 p-1"
                />
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={chatOptions.temperature}
              onChange={(e) =>
                setChatOptions({ ...chatOptions, temperature: parseFloat(e.target.value) })
              }
              className="w-full accent-gray-500 m-0 p-0"
            />

            {/* Max Tokens */}
            <div className="flex items-center gap-4 mt-4 p-0 m-0">
              <label className="text-sm font-medium w-1/3 p-0 m-0">Limit Response Length</label>
              <div className="flex items-center justify-end w-2/3 p-0 m-0">
                <Button
                  onClick={() => setChatOptions({ ...chatOptions, maxTokens: 1 })}
                  variant="ghost"
                  size="iconSm"
                  className="text-gray-500 hover:text-gray-700 p-0 m-0 mr-[-1px]"
                >
                  <Trash2 className="w-4 h-4 p-0 m-0" />
                </Button>
                <Input
                  type="number"
                  value={chatOptions.maxTokens}
                  onChange={(e) =>
                    setChatOptions({
                      ...chatOptions,
                      maxTokens: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  min={1}
                  max={4096}
                  className="w-16 p-1"
                />
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={4096}
              step={10}
              value={chatOptions.maxTokens}
              onChange={(e) =>
                setChatOptions({
                  ...chatOptions,
                  maxTokens: parseInt(e.target.value, 10) || 1,
                })
              }
              className="w-full accent-gray-500 m-0 p-0"
            />
          </Accordion>

          <Accordion title="Sampling">
            {/* Top K */}
            <div className="flex items-center gap-4 p-0 m-0">
              <label className="text-sm font-medium w-1/3 p-0 m-0">Top K Sampling</label>
              <div className="flex items-center justify-end w-2/3 p-0 m-0">
                <Button
                  onClick={() => setChatOptions({ ...chatOptions, topK: 0 })}
                  variant="ghost"
                  size="iconSm"
                  className="text-gray-500 hover:text-gray-700 p-0 m-0 mr-[-1px]"
                >
                  <Trash2 className="w-4 h-4 p-0 m-0" />
                </Button>
                <Input
                  type="number"
                  value={chatOptions.topK}
                  onChange={(e) =>
                    setChatOptions({
                      ...chatOptions,
                      topK: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  min={0}
                  max={100}
                  step={1}
                  className="w-16 p-1"
                />
              </div>
            </div>

            {/* Top P */}
            <div className="flex items-center gap-4 mt-4 p-0 m-0">
              <label className="text-sm font-medium w-1/3 p-0 m-0">Top P Sampling</label>
              <div className="flex items-center justify-end w-2/3 p-0 m-0">
                <Button
                  onClick={() => setChatOptions({ ...chatOptions, topP: 0.95 })}
                  variant="ghost"
                  size="iconSm"
                  className="text-gray-500 hover:text-gray-700 p-0 m-0 mr-[-1px]"
                >
                  <Trash2 className="w-4 h-4 p-0 m-0" />
                </Button>
                <Input
                  type="number"
                  value={chatOptions.topP}
                  onChange={(e) =>
                    setChatOptions({
                      ...chatOptions,
                      topP: parseFloat(e.target.value) || 0,
                    })
                  }
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-16 p-1"
                />
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={chatOptions.topP}
              onChange={(e) =>
                setChatOptions({
                  ...chatOptions,
                  topP: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full accent-gray-500 m-0 p-0"
            />
          </Accordion>
        </div>
      </div>

      {/* Clear Chats & System Toggle */}
      <div className="pt-4 border-t border-gray-300 dark:border-gray-700 p-0 m-0">
        <div className="flex flex-col items-start gap-2 p-0 m-0">
          <h3 className="text-lg font-semibold">Clear Chats</h3>
          <ClearChatsButton />
        </div>
        <div className="mt-4 flex flex-col items-start gap-2 p-0 m-0">
          <h3 className="text-lg font-semibold">System Toggle</h3>
          <SettingsThemeToggle />
        </div>
      </div>
    </div>
  );
}
