import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "HomeFood Backend API",
      version: "1.0.0",
      description:
        "Professional API documentation for FA-BUI frontend integration. Covers authentication, user/groups, service matching jobs, bidding, payment release, food orders, menu catalog, and AI ordering assistant."
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Local development"
      }
    ],
    tags: [
      { name: "Health", description: "Service health endpoints" },
      { name: "Auth", description: "Authentication and account recovery endpoints" },
      { name: "Users", description: "Current authenticated user endpoints" },
      { name: "Groups", description: "Team/group management" },
      { name: "Jobs", description: "Service posting and bidding" },
      { name: "Payments", description: "Escrow and release flow" },
      { name: "Orders", description: "Food orders (guest or authenticated)" },
      { name: "Menu", description: "Public menu catalog for storefront" },
      { name: "Agent", description: "AI ordering assistant (OpenAI)" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            code: { type: "string", example: "VALIDATION_ERROR" },
            message: { type: "string", example: "Invalid payload" },
            details: { type: "object", nullable: true, additionalProperties: true },
            requestId: { type: "string", example: "54fd6b66-c964-4f3d-83d6-6f0d8deab35a" }
          }
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string", example: "68196b6de3a63f2bd9aa8b9a" },
            email: { type: "string", format: "email" },
            name: { type: "string" },
            homeLocation: { type: "string" },
            isVip: { type: "boolean" },
            groupId: { type: "string", nullable: true },
            emailVerified: { type: "boolean", example: false }
          }
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Signed in successfully." },
            data: {
              type: "object",
              properties: {
                token: { type: "string" },
                user: { $ref: "#/components/schemas/User" }
              }
            }
          }
        },
        RegisterResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Account created. Verify your email to complete activation." },
            data: {
              type: "object",
              properties: {
                token: { type: "string" },
                user: { $ref: "#/components/schemas/User" },
                verificationToken: { type: "string" }
              }
            }
          }
        },
        MessageResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Password reset successfully." }
          }
        },
        ForgotPasswordResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "If this email exists, a reset link has been generated." },
            data: {
              type: "object",
              properties: {
                resetToken: { type: "string", nullable: true }
              }
            }
          }
        },
        Group: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            ownerId: { type: "string" },
            memberIds: { type: "array", items: { type: "string" } },
            isPremium: { type: "boolean" }
          }
        },
        Job: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            location: { type: "string" },
            budget: { type: "number" },
            ownerId: { type: "string" },
            status: {
              type: "string",
              enum: ["open", "assigned", "in_progress", "completed", "paid_out"]
            },
            assignedBidId: { type: "string", nullable: true },
            companyEscrowReceived: { type: "boolean" },
            workerPaid: { type: "boolean" }
          }
        },
        Bid: {
          type: "object",
          properties: {
            _id: { type: "string" },
            jobId: { type: "string" },
            bidderType: { type: "string", enum: ["user", "group"] },
            bidderUserId: { type: "string", nullable: true },
            bidderGroupId: { type: "string", nullable: true },
            amount: { type: "number" },
            message: { type: "string", nullable: true },
            selected: { type: "boolean" }
          }
        },
        Transaction: {
          type: "object",
          properties: {
            _id: { type: "string" },
            jobId: { type: "string" },
            fromUserId: { type: "string" },
            toEntity: { type: "string", enum: ["company", "worker"] },
            type: { type: "string", enum: ["escrow_deposit", "worker_release"] },
            amount: { type: "number" },
            status: { type: "string", enum: ["pending", "completed"] }
          }
        }
      }
    },
    paths: {
      "/health": {
        get: {
          tags: ["Health"],
          summary: "Health check",
          responses: {
            "200": {
              description: "API is healthy"
            }
          }
        }
      },
      "/api/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Create account",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "name", "password"],
                  properties: {
                    email: { type: "string", format: "email" },
                    name: { type: "string" },
                    password: { type: "string", format: "password" },
                    homeLocation: { type: "string", description: "Optional home/service location" },
                    isVip: { type: "boolean" }
                  }
                }
              }
            }
          },
          responses: {
            "201": {
              description: "User signed up",
              content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterResponse" } } }
            },
            "400": {
              description: "Invalid payload",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
            },
            "409": {
              description: "Email already exists",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
            }
          }
        }
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login with email and password",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["Email", "password"],
                  properties: {
                    Email: { type: "string", format: "email" },
                    password: { type: "string", format: "password" }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Login successful",
              content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } }
            },
            "400": {
              description: "Invalid payload",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
            },
            "401": {
              description: "Invalid credentials",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
            }
          }
        }
      },
      "/api/auth/forgot-password": {
        post: {
          tags: ["Auth"],
          summary: "Generate a password reset token (demo flow)",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email"],
                  properties: {
                    email: { type: "string", format: "email" }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Password reset token generated (or generic success if email is not found)",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ForgotPasswordResponse" } } }
            }
          }
        }
      },
      "/api/auth/reset-password": {
        post: {
          tags: ["Auth"],
          summary: "Reset password using reset token",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["token", "password"],
                  properties: {
                    token: { type: "string", example: "raw-reset-token-from-forgot-password" },
                    password: {
                      type: "string",
                      format: "password",
                      example: "StrongPassw0rd!"
                    }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Password reset successful",
              content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } }
            },
            "400": {
              description: "Invalid payload or expired/invalid token",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
            }
          }
        }
      },
      "/api/auth/verify-email": {
        post: {
          tags: ["Auth"],
          summary: "Verify email with verification token",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["token"],
                  properties: {
                    token: { type: "string", example: "raw-email-verification-token-from-register" }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Email verified",
              content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } }
            },
            "400": {
              description: "Invalid or expired token",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
            }
          }
        }
      },
      "/api/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Get the currently signed-in user (cookie or bearer token)",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Authenticated user",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "object",
                        properties: { user: { $ref: "#/components/schemas/User" } }
                      }
                    }
                  }
                }
              }
            },
            "401": {
              description: "Missing or invalid token",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
            }
          }
        }
      },
      "/api/auth/logout": {
        post: {
          tags: ["Auth"],
          summary: "Sign out — clears the session cookie on the server",
          responses: {
            "200": {
              description: "Session cookie cleared",
              content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } }
            }
          }
        }
      },
      "/api/users/me": {
        get: {
          tags: ["Users"],
          summary: "Get current user profile",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Current user",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/User" }
                    }
                  }
                }
              }
            },
            "401": { description: "Unauthorized" }
          }
        }
      },
      "/api/groups": {
        post: {
          tags: ["Groups"],
          summary: "Create a group",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name"],
                  properties: {
                    name: { type: "string" },
                    isPremium: { type: "boolean" }
                  }
                }
              }
            }
          },
          responses: {
            "201": {
              description: "Group created",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Group" } } }
            },
            "400": { description: "User already belongs to group or bad input" }
          }
        }
      },
      "/api/groups/{groupId}/join": {
        post: {
          tags: ["Groups"],
          summary: "Join existing group",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "groupId", in: "path", required: true, schema: { type: "string" } }
          ],
          responses: {
            "200": {
              description: "Joined group",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Group" } } }
            },
            "404": { description: "Group or user not found" }
          }
        }
      },
      "/api/groups/{groupId}": {
        get: {
          tags: ["Groups"],
          summary: "Get group details",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "groupId", in: "path", required: true, schema: { type: "string" } }
          ],
          responses: {
            "200": {
              description: "Group details",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Group" } } }
            }
          }
        }
      },
      "/api/jobs": {
        post: {
          tags: ["Jobs"],
          summary: "Create service request/job post",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title", "description", "location", "budget"],
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    location: { type: "string" },
                    budget: { type: "number" }
                  }
                }
              }
            }
          },
          responses: {
            "201": {
              description: "Job created",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Job" } } }
            }
          }
        },
        get: {
          tags: ["Jobs"],
          summary: "List all jobs",
          responses: {
            "200": {
              description: "Jobs list",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Job" } }
                }
              }
            }
          }
        }
      },
      "/api/jobs/{jobId}": {
        get: {
          tags: ["Jobs"],
          summary: "Get job details and all bids",
          parameters: [{ name: "jobId", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            "200": {
              description: "Job with bids",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      job: { $ref: "#/components/schemas/Job" },
                      bids: { type: "array", items: { $ref: "#/components/schemas/Bid" } }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/jobs/{jobId}/bids": {
        post: {
          tags: ["Jobs"],
          summary: "Submit bid as user or group",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "jobId", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["bidderType", "amount"],
                  properties: {
                    bidderType: { type: "string", enum: ["user", "group"] },
                    amount: { type: "number" },
                    message: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            "201": {
              description: "Bid created",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Bid" } } }
            }
          }
        }
      },
      "/api/jobs/{jobId}/select-bid/{bidId}": {
        post: {
          tags: ["Jobs"],
          summary: "Owner selects winning bid",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "jobId", in: "path", required: true, schema: { type: "string" } },
            { name: "bidId", in: "path", required: true, schema: { type: "string" } }
          ],
          responses: {
            "200": {
              description: "Bid selected and job assigned"
            }
          }
        }
      },
      "/api/payments/jobs/{jobId}/escrow-deposit": {
        post: {
          tags: ["Payments"],
          summary: "Deposit escrow to company account after bid selection",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "jobId", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: false,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    amount: { type: "number" }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Escrow transaction created",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      transaction: { $ref: "#/components/schemas/Transaction" },
                      job: { $ref: "#/components/schemas/Job" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/payments/jobs/{jobId}/mark-complete": {
        post: {
          tags: ["Payments"],
          summary: "Mark assigned work as completed",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "jobId", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "Job marked complete" }
          }
        }
      },
      "/api/payments/jobs/{jobId}/release-payment": {
        post: {
          tags: ["Payments"],
          summary: "Release held payment to worker/group",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "jobId", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: false,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    amount: { type: "number" }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Payment released",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      transaction: { $ref: "#/components/schemas/Transaction" },
                      job: { $ref: "#/components/schemas/Job" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/orders": {
        post: {
          tags: ["Orders"],
          summary: "Create a food order (guest or Bearer optional)",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["customerName", "customerEmail", "customerPhone", "fulfillment", "items"],
                  properties: {
                    customerName: { type: "string" },
                    customerEmail: { type: "string", format: "email" },
                    customerPhone: { type: "string" },
                    fulfillment: { type: "string", enum: ["pickup", "delivery"] },
                    addressNotes: { type: "string" },
                    items: {
                      type: "array",
                      items: {
                        type: "object",
                        required: ["dishId", "quantity"],
                        properties: {
                          dishId: { type: "string" },
                          quantity: { type: "integer", minimum: 1 }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          responses: {
            "201": { description: "Order created" },
            "400": { description: "Validation error" }
          }
        }
      },
      "/api/orders/me": {
        get: {
          tags: ["Orders"],
          summary: "List orders for the authenticated user",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": { description: "Orders list" },
            "401": { description: "Unauthorized" }
          }
        }
      },
      "/api/menu/catalog": {
        get: {
          tags: ["Menu"],
          summary: "Public menu items (ids, prices, copy)",
          responses: {
            "200": { description: "Menu catalog" }
          }
        }
      },
      "/api/agent/chat": {
        post: {
          tags: ["Agent"],
          summary: "AI assistant turn (requires OPENAI_API_KEY on server)",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["messages"],
                  properties: {
                    messages: {
                      type: "array",
                      items: {
                        type: "object",
                        required: ["role", "content"],
                        properties: {
                          role: { type: "string", enum: ["user", "assistant"] },
                          content: { type: "string" }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          responses: {
            "200": { description: "Assistant reply + optional created order" },
            "503": { description: "AI not configured" }
          }
        }
      }
    }
  },
  apis: []
};

export const openApiSpec = swaggerJsdoc(options);
