# Layout Primitives — Chakra Pattern

Layout primitives are the atomic building blocks for all spatial composition. Rather than writing flexbox and grid CSS from scratch, a primitive-based system provides named components with style props that map directly to CSS properties.

---

## The 6 Core Primitives

### Box — Base Container

Every other layout primitive extends Box. It renders a `div` by default but accepts any tag via the `as` prop. It accepts all CSS properties as props.

```tsx
import { Box } from '@chakra-ui/react'

// Basic container
<Box bg="gray.100" p={4} borderRadius="md">
  Content
</Box>

// With custom element
<Box as="section" maxW="container.xl" mx="auto">
  Page section
</Box>

// Style props map directly to CSS
<Box
  display="flex"
  flexDirection="column"
  gap={4}
  minH="100vh"
  bg="white"
  _dark={{ bg: "gray.900" }}
>
  Layout
</Box>
```

**When to use Box:** Any time you need a container that doesn't fit a semantic HTML tag, or when you need to add spacing/color/layout to an arbitrary element.

### Flex — Flexbox Container

Box with `display: flex` pre-applied. Additional flex-specific props for convenience.

```tsx
import { Flex } from '@chakra-ui/react'

// Basic flex row
<Flex justify="space-between" align="center" gap={4}>
  <Logo />
  <Nav />
  <Avatar />
</Flex>

// Flex column
<Flex direction="column" gap={6} p={8}>
  <Heading />
  <Body />
  <Footer />
</Flex>

// Centered content
<Flex justify="center" align="center" minH="100vh">
  <Card />
</Flex>
```

**Common Flex props:**
| Prop | CSS Property | Common Values |
|------|-------------|--------------|
| `direction` | `flex-direction` | `row`, `column`, `row-reverse` |
| `justify` | `justify-content` | `flex-start`, `center`, `space-between`, `flex-end` |
| `align` | `align-items` | `flex-start`, `center`, `stretch`, `flex-end` |
| `wrap` | `flex-wrap` | `wrap`, `nowrap` |
| `gap` | `gap` | spacing token or px value |

**When to use Flex:** Navigation bars, card headers, button groups, anything that aligns items in a row or column with flexible spacing.

### Grid — CSS Grid Container

Box with `display: grid` pre-applied. Expressive column and row templates.

```tsx
import { Grid, GridItem } from '@chakra-ui/react'

// Simple 3-column grid
<Grid templateColumns="repeat(3, 1fr)" gap={6}>
  <Card />
  <Card />
  <Card />
</Grid>

// Responsive grid
<Grid
  templateColumns={{
    base: "1fr",           // mobile: single column
    md: "repeat(2, 1fr)",  // tablet: 2 columns
    lg: "repeat(3, 1fr)",  // desktop: 3 columns
  }}
  gap={6}
>
  {items.map(item => <Card key={item.id} item={item} />)}
</Grid>

// Named areas (dashboard layout)
<Grid
  templateAreas={{
    base: `"header" "main" "sidebar" "footer"`,
    lg: `"header header" "sidebar main" "footer footer"`,
  }}
  templateColumns={{ base: "1fr", lg: "280px 1fr" }}
  templateRows="auto 1fr auto"
  minH="100vh"
  gap={0}
>
  <GridItem area="header"><Header /></GridItem>
  <GridItem area="sidebar"><Sidebar /></GridItem>
  <GridItem area="main"><MainContent /></GridItem>
  <GridItem area="footer"><Footer /></GridItem>
</Grid>
```

**When to use Grid:** Card grids, dashboard layouts, photo galleries, any 2D layout. Grid is correct when both rows and columns matter.

### Stack / VStack — Vertical Stacking

Stacks children vertically with consistent gap. Removes the need to manually add margin between items.

```tsx
import { Stack, VStack } from '@chakra-ui/react'

// VStack (always vertical)
<VStack gap={4} align="stretch">
  <Input placeholder="Email" />
  <Input placeholder="Password" />
  <Button type="submit">Sign In</Button>
</VStack>

// Stack defaults to vertical; can change direction
<Stack gap={6} direction="column">
  <FormField label="Name" />
  <FormField label="Email" />
  <FormField label="Message" />
</Stack>

// With dividers
<VStack gap={0} divider={<Divider />}>
  <ListItem />
  <ListItem />
  <ListItem />
</VStack>
```

**`align` prop values for Stack:**
- `stretch` (default) — children fill the container width
- `center` — children centered horizontally
- `flex-start` — children left-aligned
- `flex-end` — children right-aligned

**When to use Stack/VStack:** Forms, card content sections, any vertical list of items that need consistent spacing. Replaces the "add `mb-4` to every child" pattern.

### HStack — Horizontal Stacking

Stacks children horizontally with consistent gap. Children align to center by default.

```tsx
import { HStack } from '@chakra-ui/react'

// Icon + label
<HStack gap={2}>
  <CheckIcon />
  <Text>Item saved</Text>
</HStack>

// Button group
<HStack gap={3} justify="flex-end">
  <Button variant="ghost">Cancel</Button>
  <Button colorScheme="blue">Save</Button>
</HStack>

// Tag list
<HStack gap={2} flexWrap="wrap">
  {tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
</HStack>
```

**When to use HStack:** Icon + label pairs, button groups, inline metadata, badge rows. HStack is correct when items are in a single row and need consistent horizontal spacing.

### Container — Centered Max-Width Wrapper

Centers content horizontally with a max-width constraint. The standard page-width wrapper.

```tsx
import { Container } from '@chakra-ui/react'

// Standard centered layout
<Container maxW="container.xl" py={8}>
  <PageContent />
</Container>

// Custom max-width
<Container maxW="760px" px={4}>
  <Article />
</Container>

// Full-bleed section with centered inner content
<Box bg="gray.50" py={16}>
  <Container maxW="container.lg">
    <FeatureSection />
  </Container>
</Box>
```

**Container size tokens (Chakra defaults):**
| Token | Value |
|-------|-------|
| `container.sm` | 640px |
| `container.md` | 768px |
| `container.lg` | 1024px |
| `container.xl` | 1280px |
| `container.2xl` | 1536px |

**When to use Container:** Every page section that has a max reading width. Wrap the content of every `<section>` in a Container.

---

## Style Props Reference

Chakra's style props map shorthand prop names to CSS properties. Common ones:

| Prop | CSS Property | Example |
|------|-------------|---------|
| `bg` | `background-color` | `bg="blue.500"`, `bg="#3b82f6"` |
| `p` | `padding` | `p={4}` (= 16px on 4px base) |
| `px` | `padding-left + padding-right` | `px={6}` |
| `py` | `padding-top + padding-bottom` | `py={4}` |
| `m` | `margin` | `m={0}` |
| `mx` | `margin-left + margin-right` | `mx="auto"` |
| `my` | `margin-top + margin-bottom` | `my={8}` |
| `w` | `width` | `w="full"`, `w={200}` |
| `h` | `height` | `h="100vh"` |
| `minH` | `min-height` | `minH={0}` |
| `maxW` | `max-width` | `maxW="container.lg"` |
| `gap` | `gap` | `gap={4}` |
| `color` | `color` | `color="gray.700"` |
| `fontSize` | `font-size` | `fontSize="sm"` |
| `fontWeight` | `font-weight` | `fontWeight="bold"` |
| `borderRadius` | `border-radius` | `borderRadius="md"` |
| `shadow` | `box-shadow` | `shadow="lg"` |
| `overflow` | `overflow` | `overflow="hidden"` |
| `position` | `position` | `position="relative"` |
| `zIndex` | `z-index` | `zIndex="modal"` |

### Pseudo-props

```tsx
<Box
  _hover={{ bg: "gray.100" }}      // :hover
  _focus={{ outline: "2px solid" }} // :focus
  _active={{ transform: "scale(0.98)" }} // :active
  _dark={{ bg: "gray.800" }}       // [data-theme="dark"]
  _disabled={{ opacity: 0.4 }}     // :disabled
>
```

---

## Responsive Array Syntax

Chakra accepts arrays for responsive values. Index corresponds to breakpoint (mobile-first):

```
[mobile, sm, md, lg, xl, 2xl]
```

```tsx
// Direction changes at md breakpoint
<Flex
  direction={["column", "column", "row"]}  // col on mobile, row on md+
  gap={[4, 4, 8]}
>
  <Sidebar />
  <Main />
</Flex>

// Font size scales up
<Text fontSize={["sm", "sm", "md", "lg"]}>
  Content
</Text>

// Grid columns responsive
<Grid
  templateColumns={["1fr", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
  gap={[4, 6, 8]}
>
```

**Shorthand:** You can stop early — `["column", "row"]` means "column on mobile, row on sm+".

## Responsive Object Syntax

Alternative to arrays — more explicit, easier to read for complex responsive logic:

```tsx
<Box
  w={{ base: "full", md: "50%", lg: "33.33%" }}
  p={{ base: 4, md: 6, lg: 8 }}
  display={{ base: "none", md: "block" }}
>
```

`base` = mobile (0+). Other keys are the named Chakra breakpoints.

---

## Decision Guide: Which Primitive?

| Situation | Use |
|-----------|-----|
| I need to add a background + padding to a div | `Box` |
| I'm laying out items in a row | `HStack` or `Flex direction="row"` |
| I'm stacking items vertically | `VStack` or `Stack` |
| I need a 2D grid of items | `Grid` |
| I need to constrain page content to a max-width | `Container` |
| I'm building a complex layout (sidebar + main) | `Grid` with `templateAreas` |
| I need responsive flex direction | `Flex` with responsive `direction` prop |
| I need semantic HTML element with styles | `Box as="article"` / `Box as="section"` |

---

## Dashboard Layout Example (Complete)

```tsx
function DashboardLayout({ children }) {
  return (
    <Grid
      templateAreas={{
        base: `"header" "main"`,
        lg: `"header header" "sidebar main"`,
      }}
      templateColumns={{ base: "1fr", lg: "260px 1fr" }}
      templateRows="64px 1fr"
      minH="100vh"
      bg="gray.50"
      _dark={{ bg: "gray.950" }}
    >
      {/* Header — spans full width on all sizes */}
      <GridItem area="header" as="header">
        <Flex
          h="64px"
          px={6}
          align="center"
          justify="space-between"
          bg="white"
          _dark={{ bg: "gray.900" }}
          borderBottom="1px"
          borderColor="gray.200"
        >
          <HStack gap={3}>
            <Logo />
            <Breadcrumb />
          </HStack>
          <HStack gap={2}>
            <NotificationBell />
            <Avatar />
          </HStack>
        </Flex>
      </GridItem>

      {/* Sidebar — hidden on mobile, visible on lg+ */}
      <GridItem
        area="sidebar"
        as="nav"
        display={{ base: "none", lg: "block" }}
        bg="white"
        _dark={{ bg: "gray.900" }}
        borderRight="1px"
        borderColor="gray.200"
        overflowY="auto"
      >
        <VStack gap={1} p={3} align="stretch">
          <NavItem icon={HomeIcon} label="Dashboard" href="/" />
          <NavItem icon={ChartIcon} label="Analytics" href="/analytics" />
          <NavItem icon={SettingsIcon} label="Settings" href="/settings" />
        </VStack>
      </GridItem>

      {/* Main content */}
      <GridItem area="main" as="main" overflowY="auto">
        <Container maxW="container.xl" py={8} px={6}>
          {children}
        </Container>
      </GridItem>
    </Grid>
  )
}
```

---

## Tailwind Equivalents

For teams using Tailwind instead of Chakra, the primitives map to utility class patterns:

| Chakra | Tailwind equivalent |
|--------|-------------------|
| `<Box p={4} bg="gray.100">` | `<div class="p-4 bg-gray-100">` |
| `<Flex gap={4} align="center">` | `<div class="flex gap-4 items-center">` |
| `<VStack gap={6}>` | `<div class="flex flex-col gap-6">` |
| `<HStack gap={3}>` | `<div class="flex flex-row gap-3 items-center">` |
| `<Grid templateColumns="repeat(3, 1fr)" gap={6}>` | `<div class="grid grid-cols-3 gap-6">` |
| `<Container maxW="container.xl" mx="auto" px={4}>` | `<div class="max-w-7xl mx-auto px-4">` |
| Responsive array `[..., "row"]` at md | `flex-col md:flex-row` |
