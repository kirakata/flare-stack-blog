import { z } from "zod";
import type { OAuthScopeRequest } from "@/features/oauth-provider/schema/oauth-provider.schema";
import { defineMcpPrompt } from "../service/mcp-prompt";

const WRITE_POST_FROM_BRIEF_SCOPES: OAuthScopeRequest = {
  posts: ["read", "write"],
};

export const writePostFromBriefPrompt = defineMcpPrompt({
  name: "write_post_from_brief",
  title: "Write Post From Brief",
  description:
    "Guide the assistant through researching, drafting, and structuring a blog post.",
  requiredScopes: WRITE_POST_FROM_BRIEF_SCOPES,
  argsSchema: {
    brief: z.string().min(1).describe("Post brief or writing request."),
  },
  handler(args) {
    return {
      description:
        "Use the available blog tools to turn a brief into a solid draft.",
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: [
              `Write a blog post based on this brief: ${args.brief}`,
              "",
              "Workflow:",
              "1. Use search_posts to inspect related published posts and avoid overlap.",
              "2. Use posts_create_draft to create a draft.",
              "3. Use posts_update to write title, summary, slug, read time, and markdown body.",
              "4. If tags are helpful, inspect tags_list and then use posts_set_tags.",
              "5. Finish by summarizing what was created and what still needs review before publishing.",
            ].join("\n"),
          },
        },
      ],
    };
  },
});
