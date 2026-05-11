/**
 * yozakura-preview.ts
 *
 * A showcase file for the Yozakura color theme.
 * Open this in VS Code with Yoru (dark) or Hiru (light) active
 * to verify that all syntax roles are rendering correctly.
 *
 * Tokens covered: comments, strings, numbers, booleans, null,
 * keywords, storage, operators, functions, classes, interfaces,
 * generics, namespaces, variables, parameters, properties,
 * constants, enums, decorators, regex, and template literals.
 */

// ── Imports & Namespaces ──────────────────────────────────────────────────────

import { EventEmitter } from "events";
import * as path from "path";

// ── Constants & Primitives ────────────────────────────────────────────────────

const THEME_NAME = "Yozakura";
const VERSION    = "1.0.0";
const MAX_DEPTH  = 42;
const TAU        = 6.283185307;
const IS_DARK    = true;
const NOTHING    = null;
const UNKNOWN    = undefined;

const PALETTE_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

// ── Enum ──────────────────────────────────────────────────────────────────────

enum Flavor {
  Yoru = "yoru",
  Hiru = "hiru",
}

// ── Interface ─────────────────────────────────────────────────────────────────

interface ColorToken {
  name:    string;
  hex:     string;
  role:    "base" | "surface" | "text" | "accent";
  isDark:  boolean;
}

interface ThemeConfig<T extends ColorToken> {
  flavor:  Flavor;
  tokens:  T[];
  author:  string;
  version: string;
}

// ── Type aliases ──────────────────────────────────────────────────────────────

type HexColor  = `#${string}`;
type TokenMap  = Record<string, HexColor>;
type Validator = (hex: string) => boolean;

// ── Decorator ─────────────────────────────────────────────────────────────────

function readonly(target: object, key: string, descriptor: PropertyDescriptor) {
  descriptor.writable = false;
  return descriptor;
}

// ── Generic utility function ──────────────────────────────────────────────────

function buildTokenMap<T extends ColorToken>(tokens: T[]): TokenMap {
  return tokens.reduce<TokenMap>((acc, token) => {
    acc[token.name] = token.hex as HexColor;
    return acc;
  }, {});
}

// ── Class ─────────────────────────────────────────────────────────────────────

class YozakuraTheme<T extends ColorToken> extends EventEmitter {
  readonly name:   string;
  readonly flavor: Flavor;
  private  tokens: T[];
  private  active: boolean;

  constructor(config: ThemeConfig<T>) {
    super();
    this.name   = `${THEME_NAME} ${config.flavor}`;
    this.flavor = config.flavor;
    this.tokens = config.tokens;
    this.active = false;
  }

  @readonly
  getVersion(): string {
    return VERSION;
  }

  activate(): void {
    this.active = true;
    this.emit("activate", this.flavor);
    console.log(`Activated: ${this.name} v${this.getVersion()}`);
  }

  getToken(name: string): HexColor | null {
    const found = this.tokens.find((t) => t.name === name);
    return found ? (found.hex as HexColor) : null;
  }

  buildMap(): TokenMap {
    return buildTokenMap(this.tokens);
  }

  get isActive(): boolean {
    return this.active;
  }
}

// ── Subclass ──────────────────────────────────────────────────────────────────

class YoruTheme extends YozakuraTheme<ColorToken> {
  private depth: number;

  constructor(tokens: ColorToken[]) {
    super({ flavor: Flavor.Yoru, tokens, author: "shunsui18", version: VERSION });
    this.depth = MAX_DEPTH;
  }

  describeDepth(): string {
    return `Depth level: ${this.depth} — like the night sky over Kyoto in November`;
  }
}

// ── Arrow functions & closures ────────────────────────────────────────────────

const validateHex: Validator = (hex) => PALETTE_REGEX.test(hex);

const formatToken = (name: string, hex: HexColor): string =>
  `${name.padEnd(16)} → ${hex}`;

const buildPalette = (tokens: ColorToken[]): string[] =>
  tokens
    .filter((t) => t.isDark)
    .map((t) => formatToken(t.name, t.hex as HexColor));

// ── Template literals ─────────────────────────────────────────────────────────

const greeting = (flavor: Flavor): string =>
  `🌸 Welcome to Yozakura ${flavor === Flavor.Yoru ? "夜" : "昼"}
     Theme: ${THEME_NAME}
     Variant: ${flavor}
     TAU constant: ${TAU.toFixed(6)}`;

// ── Async / Promise ───────────────────────────────────────────────────────────

async function loadTheme(flavor: Flavor): Promise<YozakuraTheme<ColorToken>> {
  const tokens = await fetchTokens(flavor);
  const theme  = flavor === Flavor.Yoru
    ? new YoruTheme(tokens)
    : new YozakuraTheme({ flavor, tokens, author: "shunsui18", version: VERSION });

  theme.activate();
  return theme;
}

async function fetchTokens(flavor: Flavor): Promise<ColorToken[]> {
  // Simulated async data fetch
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { name: "void",    hex: flavor === Flavor.Yoru ? "#18203a" : "#f0e8f5", role: "base",    isDark: flavor === Flavor.Yoru },
        { name: "text",    hex: flavor === Flavor.Yoru ? "#d0daf0" : "#2a1848", role: "text",    isDark: flavor === Flavor.Yoru },
        { name: "blush",   hex: flavor === Flavor.Yoru ? "#d8aac4" : "#a03868", role: "accent",  isDark: flavor === Flavor.Yoru },
        { name: "petal",   hex: flavor === Flavor.Yoru ? "#b898d0" : "#8830a0", role: "accent",  isDark: flavor === Flavor.Yoru },
        { name: "moss",    hex: flavor === Flavor.Yoru ? "#7aa898" : "#287848", role: "accent",  isDark: flavor === Flavor.Yoru },
        { name: "sky",     hex: flavor === Flavor.Yoru ? "#7ab0c8" : "#2878a8", role: "accent",  isDark: flavor === Flavor.Yoru },
        { name: "lantern", hex: flavor === Flavor.Yoru ? "#f2d4b8" : "#a86018", role: "accent",  isDark: flavor === Flavor.Yoru },
        { name: "star",    hex: flavor === Flavor.Yoru ? "#e8d870" : "#887018", role: "accent",  isDark: flavor === Flavor.Yoru },
      ]);
    }, 0);
  });
}

// ── Error handling ────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  try {
    const yoru = await loadTheme(Flavor.Yoru);
    const hiru = await loadTheme(Flavor.Hiru);

    console.log(greeting(Flavor.Yoru));
    console.log(greeting(Flavor.Hiru));

    const yoruMap = yoru.buildMap();
    const hiruMap = hiru.buildMap();

    if (!validateHex(yoruMap["void"])) {
      throw new Error("Invalid hex token in Yoru palette");
    }

    console.log(path.join("themes", `${yoru.flavor}-color-theme.json`));
    console.log("Token count:", Object.keys(yoruMap).length + Object.keys(hiruMap).length);

  } catch (error) {
    if (error instanceof Error) {
      console.error(`[Yozakura] ${error.message}`);
    }
    process.exit(1);
  }
}

main();
