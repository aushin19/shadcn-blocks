import path from "node:path"

import { getLocalTokenAliasViolation } from "./local-token-aliases.mjs"

const visualAttributes = new Set([
  "appearance",
  "backgroundColor",
  "borderColor",
  "classNames",
  "color",
  "colorScheme",
  "css",
  "data-appearance",
  "data-color",
  "data-size",
  "data-theme",
  "data-tone",
  "data-variant",
  "dangerouslySetInnerHTML",
  "dense",
  "density",
  "fill",
  "fit",
  "floodColor",
  "fontSize",
  "fontWeight",
  "lightingColor",
  "opacity",
  "radius",
  "shadow",
  "shape",
  "size",
  "spacing",
  "stacked",
  "stopColor",
  "stroke",
  "styles",
  "sx",
  "theme",
  "tone",
  "variant",
])

const decorativeElements = new Set([
  "canvas",
  "embed",
  "iframe",
  "img",
  "object",
  "picture",
  "svg",
  "video",
])
const presentationWrappers = new Set(["div", "span"])
const decorativePackages = new Set([
  "@fortawesome/react-fontawesome",
  "@heroicons/react",
  "@iconify/react",
  "@phosphor-icons/react",
  "@radix-ui/react-icons",
  "@tabler/icons-react",
  "iconoir-react",
  "phosphor-react",
  "react-icons",
])

function getJsxName(name) {
  if (name?.type === "JSXIdentifier") {
    return name.name
  }

  if (name?.type === "JSXMemberExpression") {
    return `${getJsxName(name.object)}.${getJsxName(name.property)}`
  }

  return ""
}

function getAttributeName(name) {
  if (name?.type === "JSXIdentifier") {
    return name.name
  }

  if (name?.type === "JSXNamespacedName") {
    return `${name.namespace.name}:${name.name.name}`
  }

  return ""
}

function unwrapExpression(node) {
  while (
    node &&
    ["TSAsExpression", "TSSatisfiesExpression", "TSNonNullExpression"].includes(node.type)
  ) {
    node = node.expression
  }
  return node
}

function staticString(node) {
  node = unwrapExpression(node)
  if (node?.type === "Literal" && typeof node.value === "string") {
    return node.value
  }
  if (node?.type === "TemplateLiteral" && node.expressions.length === 0) {
    return node.quasis[0]?.value.cooked ?? null
  }
  return null
}

function styleObjectFor(attribute) {
  if (attribute.value?.type !== "JSXExpressionContainer") {
    return null
  }
  const expression = unwrapExpression(attribute.value.expression)
  return expression?.type === "ObjectExpression" ? expression : null
}

function isMeaningfulChild(child) {
  if (child.type === "JSXText") {
    return child.value.trim().length > 0
  }

  if (child.type === "JSXExpressionContainer") {
    return child.expression.type !== "JSXEmptyExpression"
  }

  return true
}

function isDecorativePackage(source) {
  return (
    decorativePackages.has(source) ||
    /^(?:@fortawesome\/|@heroicons\/|@iconify\/|@phosphor-icons\/|@radix-ui\/react-icons|@tabler\/icons|iconoir-react(?:\/|$)|phosphor-react(?:\/|$)|react-icons(?:\/|$))/.test(
      source
    )
  )
}

function isForbiddenVisualPackage(source) {
  return /^(?:@reui\/|@base-ui\/react(?:\/|$)|@shadcn\/react(?:\/|$)|@radix-ui\/|@mui\/|@chakra-ui\/|@headlessui\/|@mantine\/|@fluentui\/|@blueprintjs\/|@ark-ui\/|@nextui-org\/|@heroui\/|@react-spectrum\/|antd(?:\/|$)|primereact(?:\/|$)|react-bootstrap(?:\/|$)|@emotion\/|styled-components(?:\/|$)|styled-jsx(?:\/|$)|cmdk(?:\/|$)|embla-carousel-react(?:\/|$)|input-otp(?:\/|$)|react-day-picker(?:\/|$)|react-resizable-panels(?:\/|$)|recharts(?:\/|$)|framer-motion$|motion(?:\/|$))/.test(source)
}

function isStylesheet(source) {
  return typeof source === "string" && /\.(?:css|scss|sass|less|styl)(?:\?|$)/.test(source)
}

function getJsxRootName(name) {
  if (name?.type === "JSXIdentifier") {
    return name.name
  }

  if (name?.type === "JSXMemberExpression") {
    return getJsxRootName(name.object)
  }

  return ""
}

function getJsxPath(name) {
  if (name?.type === "JSXIdentifier") {
    return name.name
  }

  if (name?.type === "JSXMemberExpression") {
    return `${getJsxPath(name.object)}.${getJsxPath(name.property)}`
  }

  return ""
}

function isShadcnComponentImport(source) {
  return /^@\/components\/ui(?:\/|$)/.test(source)
}

function isConfiguredIconImport(source, importedName) {
  return source === "lucide-react" && importedName.endsWith("Icon")
}

const rules = {
  "no-visual-overrides": {
    meta: {
      type: "problem",
      docs: {
        description: "Prevent styling props while static design-token utility classes remain linted.",
      },
      schema: [],
      messages: {
        visualAttribute:
          'Remove the "{{attribute}}" styling prop. Use static Tailwind utilities for layout, spacing, typography, and design-token colors.',
        spread:
          "Replace this props spread with explicit behavior props so styling overrides cannot be hidden.",
      },
    },
    create(context) {
      return {
        JSXAttribute(node) {
          const attribute = getAttributeName(node.name)

          if (visualAttributes.has(attribute)) {
            context.report({
              node,
              messageId: "visualAttribute",
              data: { attribute },
            })
          }
        },
        JSXSpreadAttribute(node) {
          context.report({ node, messageId: "spread" })
        },
      }
    },
  },
  "no-presentation-wrappers": {
    meta: {
      type: "problem",
      docs: {
        description: "Find presentation-only wrappers that add an unnecessary visual layer.",
      },
      schema: [],
      messages: {
        wrapper:
          "Remove this presentation-only <{{element}}> wrapper. Render the base component directly, or use a semantic element that adds meaning.",
      },
    },
    create(context) {
      return {
        JSXElement(node) {
          const element = getJsxName(node.openingElement.name)

          if (!presentationWrappers.has(element)) {
            return
          }

          const children = node.children.filter(isMeaningfulChild)
          const hasSemanticAttribute = node.openingElement.attributes.some((attribute) => {
            if (attribute.type !== "JSXAttribute") {
              return false
            }

            const name = getAttributeName(attribute.name)
            return name === "id" || name === "role" || name.startsWith("aria-")
          })

          if (
            children.length === 1 &&
            ["JSXElement", "JSXFragment"].includes(children[0].type) &&
            !hasSemanticAttribute
          ) {
            context.report({
              node: node.openingElement,
              messageId: "wrapper",
              data: { element },
            })
          }
        },
      }
    },
  },
  "no-decorative-assets": {
    meta: {
      type: "problem",
      docs: {
        description: "Disallow decorative media and icon layers in raw component compositions.",
      },
      schema: [],
      messages: {
        asset:
          "Remove this decorative <{{element}}> layer. Compose the base UI components directly.",
        iconImport:
          "Remove this icon package import. Raw blocks must not add decorative icon layers.",
        visualImport:
          'Remove the visual package import "{{source}}". Use an approved local base component and preserve its default appearance.',
      },
    },
    create(context) {
      return {
        ImportDeclaration(node) {
          const source = String(node.source.value)

          if (isDecorativePackage(source)) {
            context.report({ node, messageId: "iconImport" })
          } else if (isForbiddenVisualPackage(source)) {
            context.report({ node, messageId: "visualImport", data: { source } })
          }
        },
        JSXOpeningElement(node) {
          const element = getJsxName(node.name)

          if (decorativeElements.has(element)) {
            context.report({ node, messageId: "asset", data: { element } })
          }
        },
      }
    },
  },
  "no-stylesheet-imports": {
    meta: {
      type: "problem",
      docs: {
        description: "Keep CSS out of component source and stylesheets.",
      },
      schema: [],
      messages: {
        styleImport:
          "Remove this stylesheet import. Use static Tailwind utilities and the existing design tokens.",
        styleElement:
          "Remove this <style> element. Use static Tailwind utilities and the existing design tokens.",
      },
    },
    create(context) {
      function reportIfStylesheet(node, source) {
        if (isStylesheet(source)) {
          context.report({ node, messageId: "styleImport" })
        }
      }

      return {
        ImportDeclaration(node) {
          reportIfStylesheet(node, node.source.value)
        },
        ImportExpression(node) {
          reportIfStylesheet(node, node.source.value)
        },
        JSXOpeningElement(node) {
          if (getJsxName(node.name) === "style") {
            context.report({ node, messageId: "styleElement" })
          }
        },
      }
    },
  },
  "local-token-aliases": {
    meta: {
      type: "problem",
      docs: {
        description: "Allow only component-local CSS variable aliases to existing global tokens.",
      },
      schema: [],
      messages: {
        staticObject: "Define local tokens in a static style object in this TSX file.",
        objectProperty: "Local token objects cannot contain spreads or computed properties.",
        invalidName: "{{message}}",
        invalidValue: "{{message}}",
        duplicate: "Define each local token alias only once in this TSX file.",
        unused: "Use this local token alias in a static Tailwind utility class, or remove it.",
        missing: 'Define "{{name}}" as a local alias in a style object in this TSX file before using it.',
      },
    },
    create(context) {
      const filename = path.basename(context.filename ?? context.getFilename()).replace(/\.[^.]+$/, "")
      const aliases = new Map()
      const sourceCode = context.sourceCode ?? context.getSourceCode()
      const localTokenClassPattern = /(?:^|[\s:"'`])(?:bg|border|fill|font|outline|ring|shadow|stroke|text)-\((?:(?:color|family|length|size):)?(--[a-z0-9-]+)\)(?=$|[\s"'`])/g

      return {
        JSXAttribute(node) {
          if (getAttributeName(node.name) !== "style") {
            return
          }

          const styleObject = styleObjectFor(node)
          if (!styleObject) {
            context.report({ node, messageId: "staticObject" })
            return
          }

          for (const property of styleObject.properties) {
            if (
              property.type !== "Property" ||
              property.kind !== "init" ||
              property.computed ||
              property.method
            ) {
              context.report({ node: property, messageId: "objectProperty" })
              continue
            }

            const name = staticString(property.key) ?? (property.key.type === "Identifier" ? property.key.name : null)
            const value = staticString(property.value)
            const error = getLocalTokenAliasViolation(name, value, filename)

            if (error) {
              context.report({
                node: property,
                messageId: name?.startsWith(`--${filename}-`) ? "invalidValue" : "invalidName",
                data: { message: error },
              })
              continue
            }

            if (aliases.has(name)) {
              context.report({ node: property, messageId: "duplicate" })
              continue
            }

            aliases.set(name, node)
          }
        },
        "Program:exit"(node) {
          const tokenUses = new Map()
          for (const match of sourceCode.text.matchAll(localTokenClassPattern)) {
            const tokenName = match[1]
            tokenUses.set(tokenName, (tokenUses.get(tokenName) ?? 0) + 1)
          }

          for (const [name, count] of tokenUses) {
            if (!aliases.has(name)) {
              context.report({ node, messageId: "missing", data: { name } })
            } else if (count > 0) {
              aliases.delete(name)
            }
          }

          for (const nodeForAlias of aliases.values()) {
            context.report({ node: nodeForAlias, messageId: "unused" })
          }
        },
      }
    },
  },
  "no-non-shadcn-components": {
    meta: {
      type: "problem",
      docs: {
        description: "Require rendered imported components to come from local shadcn UI primitives.",
      },
      schema: [],
      messages: {
        componentImport:
          'Use a local shadcn component for "{{name}}". Import it from "@/components/ui/..." instead of "{{source}}".',
      },
    },
    create(context) {
      const importedNames = new Map()
      const jsxPathsByRoot = new Map()

      return {
        ImportDeclaration(node) {
          const source = String(node.source.value)

          for (const specifier of node.specifiers) {
            let importedName = specifier.local.name

            if (specifier.type === "ImportSpecifier") {
              importedName = specifier.imported.name ?? specifier.imported.value
            } else if (specifier.type === "ImportNamespaceSpecifier") {
              importedName = "*"
            }

            importedNames.set(specifier.local.name, {
              node: specifier,
              source,
              importedName,
            })
          }
        },
        JSXOpeningElement(node) {
          const rootName = getJsxRootName(node.name)
          const jsxPaths = jsxPathsByRoot.get(rootName) ?? new Set()
          jsxPaths.add(getJsxPath(node.name))
          jsxPathsByRoot.set(rootName, jsxPaths)
        },
        "Program:exit"() {
          for (const [localName, imported] of importedNames) {
            const jsxPaths = jsxPathsByRoot.get(localName)

            if (!jsxPaths) {
              continue
            }

            const isReactFragment =
              imported.source === "react" &&
              (imported.importedName === "Fragment" ||
                ((imported.importedName === "*" || imported.importedName === localName) &&
                  [...jsxPaths].every((jsxPath) => jsxPath === `${localName}.Fragment`)))

          if (
            isReactFragment ||
            isShadcnComponentImport(imported.source) ||
            isConfiguredIconImport(imported.source, imported.importedName)
          ) {
              continue
            }

            context.report({
              node: imported.node,
              messageId: "componentImport",
              data: { name: localName, source: imported.source },
            })
          }
        },
      }
    },
  },
}

const rawComponents = {
  meta: { name: "eslint-plugin-raw-components" },
  rules,
}

export default rawComponents
