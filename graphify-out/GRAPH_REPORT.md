# Graph Report - shellfolio  (2026-08-30)

## Corpus Check
- 111 files · ~315,501 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 669 nodes · 1131 edges · 84 communities (30 shown, 54 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 35 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Terminal Outputs & Portfolio Data
- Terminal Core Infrastructure
- UI Layout Components
- UI Forms & Navigation
- Home Page & Visual Effects
- Project Configuration
- TypeScript Configuration
- Toast Notification System
- Documentation & Blueprint
- UI Data Display Components
- CV & Credentials
- shadcn/ui Configuration
- Theme Management
- UI Menubar Components
- UI Dialog & Buttons
- UI Form & Label
- UI Carousel
- Key Dependencies
- UI Chart Components
- Brand Assets & Images
- UI Sheet Components
- UI Select Components
- UI Dialog Components
- Iridescence Shader Effect
- App Layout & Analytics
- UI Alert Components
- UI Badge Components
- PostCSS Configuration
- clsx Utility
- Vercel Ship Event
- date-fns Library
- Dev Log Notes
- dotenv Library
- Embla Carousel
- Firebase Library
- Genkit Library
- Genkit AI Google
- Hook Form Resolvers
- Lucide React Icons
- Meshline Library
- Microsoft Clarity
- Next.js Framework
- Next.js Config
- OGL Library
- Patch Package
- Radix AlertDialog
- Radix Avatar
- Radix Checkbox
- Radix Collapsible
- Radix Dialog
- Radix Label
- Radix Menubar
- Radix Popover
- Radix Progress
- Radix RadioGroup
- Radix ScrollArea
- Radix Select
- Radix Separator
- Radix Slider
- Radix Slot
- Radix Switch
- Radix Toast
- Radix Tooltip
- React Library
- React Day Picker
- React DOM
- React Hook Form
- React Three Drei
- React Three Rapier
- Recharts Library
- Tailwind Merge
- Tailwind Animate
- Three.js Library
- Vercel Analytics
- Vercel Speed Insights
- Zod Validation
- Genkit AI Setup
- App Hosting Config
- Security Basics PDF

## God Nodes (most connected - your core abstractions)
1. `cn()` - 165 edges
2. `Command` - 19 edges
3. `compilerOptions` - 16 edges
4. `HistoryStore` - 15 edges
5. `SSR Migration Notes` - 15 edges
6. `CommandRegistry` - 13 edges
7. `Peter Mölzer` - 13 edges
8. `HELP_MENU` - 11 edges
9. `useTerminal()` - 11 edges
10. `VirtualFileSystem` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Shellfolio README` --conceptually_related_to--> `Shellfolio Blueprint`  [INFERRED]
  README.md → docs/blueprint.md
- `Badge - Peter Mölzer Profile Card` --references--> `Shellfolio Brand Identity`  [INFERRED]
  public/images/badge_cc.png → .idx/icon.png
- `Badge - Peter Mölzer Square Profile` --semantically_similar_to--> `Badge - Peter Mölzer Profile Card`  [INFERRED] [semantically similar]
  public/images/badge_sq.png → public/images/badge_cc.png
- `AlertDialogOverlay` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `AlertDialogContent` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Terminal System Components** — docs_ssr_terminalshellframe, docs_ssr_terminalinteractive, docs_ssr_terminalpromptline, docs_ssr_quickactions, docs_ssr_terminalreset, docs_ssr_terminalwelcome [INFERRED 0.85]
- **Visual Effects System** — docs_ssr_visualeffects, docs_ssr_grainient, docs_ssr_badge [EXTRACTED 1.00]
- **Rendering Strategy Concepts** — docs_ssr_csr, docs_ssr_ssr, docs_ssr_staticprerendering, docs_ssr_clientisland, docs_ssr_serversafe [INFERRED 0.75]
- **Peter Mölzer's Educational Background** — public_files_petermoelzeren_peter_molzer, public_files_petermoelzeren_42berlin, public_files_petermoelzeren_humboldt_university, public_files_coursera_meta_frontend_developer_certificate [EXTRACTED 1.00]
- **Peter Mölzer's Professional Work Experience** — public_files_petermoelzeren_peter_molzer, public_files_petermoelzeren_innobee, public_files_petermoelzeren_yellow_srl, public_files_petermoelzeren_klarna, public_files_petermoelzeren_clark [EXTRACTED 1.00]
- **Transcendence Multiplayer Game Platform Architecture** — public_files_petermoelzeren_transcendence, public_files_petermoelzeren_microservices_architecture, public_files_petermoelzeren_real_time_communication [EXTRACTED 1.00]
- **Peter Mölzer Profile Image Variants** — public_favicon16x16, public_images_badge_cc, public_images_badge_cc_reduced, public_images_badge_main, public_images_badge_sq, public_images_band, public_images_band_new [INFERRED 0.85]
- **Shellfolio Brand and Identity Assets** — idx_icon, concept_shellfolio_brand, concept_peter_molzer [INFERRED 0.75]
- **Particle Disintegration Effect Image Variants** — public_images_badge_main, public_images_band_new [INFERRED 0.85]

## Communities (84 total, 54 thin omitted)

### Community 0 - "Terminal Outputs & Portfolio Data"
Cohesion: 0.05
Nodes (57): About(), Contact(), Credentials(), cv, Education(), Projects(), WorkExperience(), OutputCode() (+49 more)

### Community 1 - "Terminal Core Infrastructure"
Cohesion: 0.08
Nodes (18): AutocompleteEngine, CommandParser, HistoryStore, autocompleteInstance, registryInstance, TerminalContext, TerminalProvider(), TerminalProviderState (+10 more)

### Community 2 - "UI Layout Components"
Cohesion: 0.10
Nodes (32): AccordionContent, AccordionItem, AccordionTrigger, Card, CardContent, CardDescription, CardFooter, CardHeader (+24 more)

### Community 3 - "UI Forms & Navigation"
Cohesion: 0.07
Nodes (31): Input, Separator, Sidebar, SidebarContent, SidebarContext, SidebarFooter, SidebarGroup, SidebarGroupAction (+23 more)

### Community 4 - "Home Page & Visual Effects"
Cohesion: 0.11
Nodes (16): Grainient(), GrainientProps, hexToRgb(), QuickActions(), Terminal(), TerminalInteractiveViewport(), TerminalPromptLine(), TerminalResetButton() (+8 more)

### Community 5 - "Project Configuration"
Cohesion: 0.07
Nodes (26): genkit-cli, devDependencies, genkit-cli, postcss, tailwindcss, @types/node, @types/react, @types/react-dom (+18 more)

### Community 6 - "TypeScript Configuration"
Cohesion: 0.07
Nodes (26): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+18 more)

### Community 7 - "Toast Notification System"
Cohesion: 0.12
Nodes (24): Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle, toastVariants (+16 more)

### Community 8 - "Documentation & Blueprint"
Cohesion: 0.13
Nodes (23): Shellfolio Blueprint, Custom Commands, Enhance Description, Format Output, List Commands, Terminal Interface, Badge Component, Client Islands (+15 more)

### Community 9 - "UI Data Display Components"
Cohesion: 0.10
Nodes (11): Avatar, AvatarFallback, AvatarImage, Checkbox, PopoverContent, Progress, ScrollArea, ScrollBar (+3 more)

### Community 10 - "CV & Credentials"
Cohesion: 0.12
Nodes (19): AI Anthropic (Document), Meta Front-End Certificate Courses (9 courses), Meta Front-End Developer Professional Certificate, 42 Berlin (Computer Science), CLARK, The Macroeconomics of Rational Bubbles (Thesis), Humboldt University (B.Sc. Economics), InnoBee (+11 more)

### Community 11 - "shadcn/ui Configuration"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 12 - "Theme Management"
Cohesion: 0.16
Nodes (9): ThemeManager, allThemes, draculaTheme, gruvboxTheme, modernDarkTheme, phosphorTheme, solarizedTheme, ubuntuTheme (+1 more)

### Community 13 - "UI Menubar Components"
Cohesion: 0.12
Nodes (11): Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator, MenubarShortcut() (+3 more)

### Community 14 - "UI Dialog & Buttons"
Cohesion: 0.17
Nodes (13): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle (+5 more)

### Community 15 - "UI Form & Label"
Cohesion: 0.19
Nodes (12): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+4 more)

### Community 16 - "UI Carousel"
Cohesion: 0.19
Nodes (13): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+5 more)

### Community 17 - "Key Dependencies"
Cohesion: 0.15
Nodes (13): class-variance-authority, @genkit-ai/next, dependencies, class-variance-authority, @genkit-ai/next, @radix-ui/react-accordion, @radix-ui/react-dropdown-menu, @radix-ui/react-tabs (+5 more)

### Community 18 - "UI Chart Components"
Cohesion: 0.25
Nodes (9): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartTooltipContent, getPayloadConfigFromPayload(), THEMES (+1 more)

### Community 19 - "Brand Assets & Images"
Cohesion: 0.36
Nodes (10): Peter Mölzer - Software Developer, Shellfolio Brand Identity, Shellfolio App Icon, Favicon - Peter Mölzer Headshot, Badge - Peter Mölzer Profile Card, Badge - Peter Mölzer Thumbnail, Badge - Peter Mölzer Profile with Particle Effect, Badge - Peter Mölzer Square Profile (+2 more)

### Community 20 - "UI Sheet Components"
Cohesion: 0.25
Nodes (8): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 21 - "UI Select Components"
Cohesion: 0.25
Nodes (7): SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger

### Community 22 - "UI Dialog Components"
Cohesion: 0.29
Nodes (6): DialogContent, DialogDescription, DialogFooter(), DialogHeader(), DialogOverlay, DialogTitle

### Community 25 - "UI Alert Components"
Cohesion: 0.50
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 26 - "UI Badge Components"
Cohesion: 0.67
Nodes (3): Badge(), BadgeProps, badgeVariants

## Knowledge Gaps
- **172 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+167 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **54 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `UI Layout Components` to `UI Forms & Navigation`, `Toast Notification System`, `UI Data Display Components`, `UI Menubar Components`, `UI Dialog & Buttons`, `UI Form & Label`, `UI Carousel`, `UI Chart Components`, `UI Sheet Components`, `UI Select Components`, `UI Dialog Components`, `UI Alert Components`, `UI Badge Components`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Key Dependencies` to `Project Configuration`, `clsx Utility`, `date-fns Library`, `dotenv Library`, `Embla Carousel`, `Firebase Library`, `Genkit Library`, `Genkit AI Google`, `Hook Form Resolvers`, `Lucide React Icons`, `Meshline Library`, `Microsoft Clarity`, `Next.js Framework`, `OGL Library`, `Patch Package`, `Radix AlertDialog`, `Radix Avatar`, `Radix Checkbox`, `Radix Collapsible`, `Radix Dialog`, `Radix Label`, `Radix Menubar`, `Radix Popover`, `Radix Progress`, `Radix RadioGroup`, `Radix ScrollArea`, `Radix Select`, `Radix Separator`, `Radix Slider`, `Radix Slot`, `Radix Switch`, `Radix Toast`, `Radix Tooltip`, `React Library`, `React Day Picker`, `React DOM`, `React Hook Form`, `React Three Drei`, `React Three Rapier`, `Recharts Library`, `Tailwind Merge`, `Tailwind Animate`, `Three.js Library`, `Vercel Analytics`, `Vercel Speed Insights`, `Zod Validation`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _172 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Terminal Outputs & Portfolio Data` be split into smaller, more focused modules?**
  _Cohesion score 0.054136874361593465 - nodes in this community are weakly interconnected._
- **Should `Terminal Core Infrastructure` be split into smaller, more focused modules?**
  _Cohesion score 0.08048103607770583 - nodes in this community are weakly interconnected._
- **Should `UI Layout Components` be split into smaller, more focused modules?**
  _Cohesion score 0.09672830725462304 - nodes in this community are weakly interconnected._
- **Should `UI Forms & Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.07057057057057058 - nodes in this community are weakly interconnected._