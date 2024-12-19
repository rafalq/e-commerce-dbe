"use client";

import { Toggle } from "@/components/ui/toggle";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Strikethrough } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useFormContext } from "react-hook-form";
import { Placeholder } from "@tiptap/extension-placeholder";

const Tiptap = forwardRef(({ val }: { val: string }, ref) => {
  const { setValue } = useFormContext();
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Placeholder.configure({
        // placeholder: "This is a description of a new product.",
        emptyNodeClass:
          "first:before:text-gray-400 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none",
      }),
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-4",
          },
        },

        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-4",
          },
        },

        paragraph: {
          HTMLAttributes: {
            class: "min-h-[1rem]",
          },
        },
      }),
    ],

    onUpdate: ({ editor }) => {
      const content = editor.getHTML().replace(/&nbsp;/g, " ");

      setValue("description", content, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      },
    },
    content: val,
  });

  useEffect(() => {
    if (editor?.isEmpty) {
      editor.commands.setContent(val);
    }
  }, [val]);

  useImperativeHandle(ref, () => ({
    clearContent: () => editor?.commands.clearContent(),
  }));

  return (
    <div className="flex flex-col gap-2">
      {editor && (
        <div className="flex items-center gap-1 border-secondary p-1 border rounded-md">
          <Toggle
            pressed={editor.isActive("bold")}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
            size={"sm"}
            className="w-8 h-8"
          >
            <Bold />
          </Toggle>
          <Toggle
            pressed={editor.isActive("italic")}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            size={"sm"}
            className="w-8 h-8"
          >
            <Italic />
          </Toggle>
          <Toggle
            pressed={editor.isActive("strike")}
            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
            size={"sm"}
            className="w-8 h-8"
          >
            <Strikethrough />
          </Toggle>
          <Toggle
            pressed={editor.isActive("orderedList")}
            onPressedChange={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
            size={"sm"}
            className="w-8 h-8"
          >
            <ListOrdered />
          </Toggle>
          <Toggle
            pressed={editor.isActive("bulletList")}
            onPressedChange={() =>
              editor.chain().focus().toggleBulletList().run()
            }
            size={"sm"}
            className="w-8 h-8"
          >
            <List />
          </Toggle>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
});

Tiptap.displayName = "Tiptap";

export default Tiptap;
