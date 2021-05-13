// Global style overrides
import styles from "./styles"

// Foundational style overrides
import colors from "./foundations/colors"
import shadows from "./foundations/shadows"
import typography from "./foundations/typography"

// Component style overrides
import Container from "./components/container"
import Heading from "./components/heading"
import Button from "./components/button"
import Drawer from "./components/drawer"
import Link from "./components/link"

const overrides = {
  styles,
  colors,
  shadows,
  ...typography,
  components: {
    Container,
    Heading,
    Button,
    Drawer,
    CloseButton: { ...Button },
    Link,
  },
}

export default overrides
