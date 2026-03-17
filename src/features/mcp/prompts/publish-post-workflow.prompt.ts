import { z } from "zod";
import type { OAuthScopeRequest } from "@/features/oauth-provider/schema/oauth-provider.schema";
import { defineMcpPrompt } from "../service/mcp-prompt";

const PUBLISH_POST_WORKFLOW_SCOPES: OAuthScopeRequest = {
  posts: ["read", "write"],
};

export const publishPostWorkflowPrompt = defineMcpPrompt({
  name: "publish_post_workflow",
  title: "Publish Post Workflow",
  description:
    "Guide the assistant through checking and publishing an existing post.",
  requiredScopes: PUBLISH_POST_WORKFLOW_SCOPES,
  argsSchema: {
    postId: z.string().min(1).describe("Numeric post ID to publish."),
  },
  handler(args) {
    return {
      description:
        "Inspect a post, confirm readiness, and publish it with the correct workflow.",
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: [
              `Review and publish post ${args.postId}.`,
              "",
              "Workflow:",
              "1. Use posts_get to inspect the current title, summary, tags, status, and markdown body.",
              "2. If obvious metadata or content gaps exist, fix them with posts_update first.",
              "3. Use posts_set_visibility with visibility='published' to publish the post.",
              "4. Summarize any issues you fixed and confirm the post is now published.",
            ].join("\n"),
          },
        },
      ],
    };
  },
});
