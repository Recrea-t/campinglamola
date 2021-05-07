// Global style overrides
import styles from "./styles"

// Foundational style overrides
import colors from "./foundations/colors"
import shadows from "./foundations/shadows"
import typography from "./foundations/typography"

// Component style overrides
import FormLabel from "./components/form-label"
import Container from "./components/container"
import Heading from "./components/heading"
import Button from "./components/button"
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
    CloseButton: { ...Button },
    Link,
    FormLabel,
  },
}

export default overrides
