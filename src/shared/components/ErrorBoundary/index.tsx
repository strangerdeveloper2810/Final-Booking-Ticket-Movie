import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Custom fallback UI — nếu không truyền thì dùng UI mặc định */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    // Có thể gửi lên Sentry / logging service ở đây
    console.error("[ErrorBoundary] Uncaught error:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div style={styles.wrapper}>
          <div style={styles.card}>
            {/* Icon */}
            <div style={styles.iconWrapper}>
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F2545B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <h1 style={styles.title}>Oops! Có lỗi xảy ra</h1>
            <p style={styles.subtitle}>
              Something went wrong. The application encountered an unexpected
              error.
            </p>

            {/* Error message */}
            {this.state.error && (
              <div style={styles.errorBox}>
                <code style={styles.errorText}>
                  {this.state.error.message}
                </code>
              </div>
            )}

            <div style={styles.actions}>
              <button
                style={styles.btnPrimary}
                onClick={this.handleReset}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
                }
              >
                🔄 Thử lại
              </button>
              <button
                style={styles.btnSecondary}
                onClick={() => (window.location.href = "/")}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.borderColor =
                    "#F2545B")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(255,255,255,0.15)")
                }
              >
                🏠 Về trang chủ
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/* ─── Inline Styles ─────────────────────────────────────────────────────── */
const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0D1117 0%, #161B27 100%)",
    padding: "2rem",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  card: {
    maxWidth: "480px",
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "1.5rem",
    padding: "3rem 2.5rem",
    textAlign: "center",
    backdropFilter: "blur(12px)",
    boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
  },
  iconWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1.5rem",
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#ffffff",
    margin: "0 0 0.75rem",
  },
  subtitle: {
    fontSize: "0.9375rem",
    color: "#8B939E",
    margin: "0 0 1.5rem",
    lineHeight: 1.6,
  },
  errorBox: {
    background: "rgba(242,84,91,0.08)",
    border: "1px solid rgba(242,84,91,0.25)",
    borderRadius: "0.5rem",
    padding: "0.875rem 1rem",
    marginBottom: "2rem",
    textAlign: "left",
    overflowX: "auto",
  },
  errorText: {
    fontSize: "0.8125rem",
    color: "#F2545B",
    wordBreak: "break-word",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  },
  actions: {
    display: "flex",
    gap: "0.875rem",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  btnPrimary: {
    padding: "0.75rem 1.75rem",
    background: "linear-gradient(135deg, #F2545B, #c73d43)",
    border: "none",
    borderRadius: "0.625rem",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: "0.9375rem",
    cursor: "pointer",
    transition: "opacity 0.2s",
    letterSpacing: "0.01em",
  },
  btnSecondary: {
    padding: "0.75rem 1.75rem",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "0.625rem",
    color: "#A0A5B5",
    fontWeight: 600,
    fontSize: "0.9375rem",
    cursor: "pointer",
    transition: "border-color 0.2s",
    letterSpacing: "0.01em",
  },
};

export default ErrorBoundary;
