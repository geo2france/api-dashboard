import { Button, Layout, Space, theme, Typography } from "antd";
import { CSSProperties, useContext, useEffect, useRef, useState } from "react";
import Slider from "@ant-design/react-slick";

import { Icon } from "@iconify/react";
import { Partner } from "../../types";
import { AppContext } from "./DashboardApp";
import { Z_INDEX } from "../../utils/zIndex";
import { useBrandForeground, WCAG_CONTRAST } from "../../theme";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const { Text } = Typography;
const { useToken } = theme;

/**
 * Seuils responsives du carrousel (source unique, aussi utilisée pour le
 * `responsive` du <Slider>). `breakpoint` = max-width slick. La liste DOIT
 * rester croissante pour que `.find` attrape le plus petit seuil correspondant.
 */
const BREAKPOINTS = [
  { breakpoint: 480, slides: 1 },
  { breakpoint: 600, slides: 2 },
  { breakpoint: 1024, slides: 3 },
] as const;
const DEFAULT_SLIDES = 4; // > 1024px

const slidesForWidth = (w: number) =>
  BREAKPOINTS.find((b) => w <= b.breakpoint)?.slides ?? DEFAULT_SLIDES;

interface DbFooterProps {
    brands?: Partner[];
    slider?: boolean;
}

/* Logo d'un partenaire : lien (nouvel onglet) si URL fournie, sinon image seule.
 * Hauteur contrainte (48px, surchargeable via `partner.height`) sans déformation.
 *
 * ⚠️ Le `style` reçu en prop est injecté par react-slick, qui écrase le style
 * de chaque enfant direct. On l'absorbe sur un wrapper pour protéger l'image. */
const PartnerLogo: React.FC<{ partner: Partner; slider?: boolean; style?: CSSProperties }> = ({
  partner,
  slider,
  style,
}) => {
  const imgStyle: CSSProperties = {
    display: "block",
    height: partner.height ?? 48,
    width: "auto",
    maxWidth: "100%",
    objectFit: "contain",
    // Centrage horizontal dans la slide ; en flex, le conteneur s'en charge.
    margin: slider ? "0 auto" : 0,
  };
  const img = (
    <img
      style={imgStyle}
      src={partner.logo}
      alt={partner.name}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  );
  const inner = partner.url ? (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${partner.name} (ouvre un nouvel onglet)`}
      style={{ display: "block" }}
    >
      {img}
    </a>
  ) : (
    img
  );
  // Le wrapper absorbe le `style` injecté par react-slick, jamais l'image.
  return <div style={style}>{inner}</div>;
};

export const DasbhoardFooter: React.FC<DbFooterProps> = ({brands, slider=true}) => {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768 ? true : false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  );

  // Pilote les flèches externes (le carrousel masque ses flèches internes).
  const sliderRef = useRef<Slider>(null);

  const { token } = useToken()
  const brandFg = useBrandForeground()
  // Hover de l'icône de scroll : avant-plan de marque accessible sur le fond
  // du footer (seuil UI 3:1) — repli neutre si la primaire échoue le contraste.
  const scrollIconHoverColor = brandFg(token.colorBgContainer, WCAG_CONTRAST.UI)

  // Affiche le scrollIndicator tant qu'il reste du contenu sous le viewport,
  // et tient à jour la largeur courante (nb de logos visibles + contrôles).
  useEffect(() => {
    const checkShadow = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      setShowScrollIndicator(scrollTop + windowHeight < docHeight - 1);
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("scroll", checkShadow);
    window.addEventListener("resize", checkShadow);
    const observer = new ResizeObserver(checkShadow);
    observer.observe(document.body);

    checkShadow();

    return () => {
      window.removeEventListener("scroll", checkShadow);
      window.removeEventListener("resize", checkShadow);
      observer.disconnect();
    };
  }, []);

  /* `prefers-reduced-motion` : coupe l'autoplay et le glissement animé. */
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    setPrefersReducedMotion(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);


  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const app_context = useContext(AppContext)

  const nbBrands = brands?.length || 0

  // Logos visibles à la largeur courante (borné par nbBrands) et débordement.
  const visibleSlides = Math.max(1, Math.min(nbBrands, slidesForWidth(viewportWidth)));
  const hasOverflow = nbBrands > visibleSlides;
  // Flèches affichées seulement quand utiles : déplié, slider, débordement.
  const showControls = !isCollapsed && slider && nbBrands > 0 && hasOverflow;

  // `responsive` slick dérivé de BREAKPOINTS.
  const responsive = BREAKPOINTS.map(({ breakpoint, slides }) => {
    const n = Math.max(1, Math.min(nbBrands, slides));
    return {
      breakpoint,
      settings: {
        slidesToShow: n,
        slidesToScroll: n,
        autoplay: !prefersReducedMotion && nbBrands > slides,
        dots: nbBrands > slides,
      },
    };
  });

  // Logos des partenaires.
  const footerContent = brands?.map((p: Partner, i: number) => (
    <PartnerLogo key={`${p.name}-${i}`} partner={p} slider={slider} />
  ))

  return (
    <Layout.Footer
      style={{
        textAlign: "center",
        color: token.colorText,
        backgroundColor: token.colorBgContainer,
        bottom: "0",
        position: "sticky",
        right: "0",
        width: "100%",
        padding: 2,
        height: "auto",
        minHeight: "40px",
        transition: "height 0.5s ease-in-out",
        overflow: "visible",
        borderTop: `1px solid ${token.colorBorder}`,
        zIndex: Z_INDEX.FOOTER,
      }}
    >
      {/* Animations du scroll indicator (apparition + survol) */}
      <style>
        {`
          .scroll-indicator {
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          .scroll-indicator--visible {
            opacity: 1;
            transform: translateY(0);
          }
          .scroll-indicator__icon {
            pointer-events: none;
            transition: color 0.2s ease;
          }
          .scroll-indicator--visible .scroll-indicator__icon {
            pointer-events: auto;
          }
          .scroll-indicator--visible .scroll-indicator__icon:hover {
            color: ${scrollIconHoverColor};
            animation: scroll-indicator-bob 0.9s ease-in-out infinite;
          }
          @keyframes scroll-indicator-bob {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(4px); }
          }
          @media (prefers-reduced-motion: reduce) {
            .scroll-indicator,
            .scroll-indicator__icon {
              transition: none;
            }
            .scroll-indicator--visible {
              transform: none;
            }
            .scroll-indicator--visible .scroll-indicator__icon:hover {
              animation: none;
            }
            /* Coupe le glissement animé du carrousel (autoplay déjà off en JS). */
            .partner-slider .slick-track {
              transition: none !important;
            }
          }

          /* Centrage vertical des logos : piste en flex + slides height:auto
             (sinon les logos plus courts se collent en haut). */
          .partner-slider .slick-track {
            display: flex;
            align-items: center;
          }
          .partner-slider .slick-slide {
            height: auto;
          }

          /* Resserre l'écart entre les dots slick. */
          .partner-slider .slick-dots li {
            width: 12px;
            margin: 0 1px;
          }

          /* Cluster de contrôles (pilule [← | →] + bouton de repli) */
          .footer-controls__group .ant-btn:first-child {
            border-start-start-radius: 20px;
            border-end-start-radius: 20px;
          }
          .footer-controls__group .ant-btn:last-child {
            border-start-end-radius: 20px;
            border-end-end-radius: 20px;
          }
        `}
      </style>
      {/* Dégradé + chevron : signale qu'il reste du contenu à scroller */}
      <div
        className={`scroll-indicator${showScrollIndicator ? " scroll-indicator--visible" : ""}`}
        aria-hidden
        style={{
          position: "absolute",
          top: -250,
          left: 0,
          right: 0,
          height: 250,
          pointerEvents: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          paddingBottom: 8,
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          maskImage: "linear-gradient(to bottom, transparent, black)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black)",
          background:
            `linear-gradient(to bottom, transparent, ${token.colorBgContainer})`,
        }}
      >
        <Icon
          icon="material-symbols:keyboard-arrow-down-rounded"
          className="scroll-indicator__icon"
          style={{ color: token.colorText, fontSize: 28 }}
        />
      </div>

      {/* Footer rétracté : titre seul */}
      {isCollapsed && (
            <Text type="secondary">{app_context?.title} - {app_context?.subtitle}</Text>
      )}

      {/* Footer déplié : logos (+ espace réservé sous le slider pour les dots) */}
      <div style={{
        display: isCollapsed ? "none" : "block",
        padding: "10px 0",
        paddingBottom: slider && hasOverflow ? 32 : 10,
      }}>
        {
          // Aucun partenaire : footer sans zone logos
          nbBrands === 0
          ? null
          : slider
          // Logos défilants (défaut). Autoplay et défilement par page si débordement.
          ? <Slider
              ref={sliderRef}
              className="partner-slider"
              autoplay={!prefersReducedMotion && nbBrands > DEFAULT_SLIDES}
              slidesToShow={Math.max(1, Math.min(nbBrands, DEFAULT_SLIDES))}
              slidesToScroll={Math.max(1, Math.min(nbBrands, DEFAULT_SLIDES))}
              dots={nbBrands > DEFAULT_SLIDES}
              responsive={responsive}
              infinite={true}
              arrows={false} // pilotées via sliderRef
              pauseOnFocus={true} // a11y : pause au focus clavier
              autoplaySpeed={6000}
              speed={1000}
            >
              {footerContent}
            </Slider>
          // Sans défilement : logos en ligne centrés
          : <div style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: 20,
            }}>
              {footerContent}
            </div>
        }
      </div>

      {/* Cluster de contrôles flottant en haut à droite : pilule [← | →] +
          bouton de repli. Flèches visibles seulement en cas de débordement.
          Rendu de la pilule géré par le bloc <style> (.footer-controls*). */}
      <div
        className="footer-controls"
        style={{
          position: "absolute",
          bottom: "100%",
          right: 10,
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          gap: 8,
          zIndex: Z_INDEX.FOOTER_BUTTON,
        }}
      >
        {showControls && (
          <Space.Compact className="footer-controls__group">
            <Button
              size="large"
              aria-label="Logos précédents"
              icon={<Icon icon="material-symbols:arrow-back-rounded" />}
              onClick={() => sliderRef.current?.slickPrev()}
            />
            <Button
              size="large"
              aria-label="Logos suivants"
              icon={<Icon icon="material-symbols:arrow-forward-rounded" />}
              onClick={() => sliderRef.current?.slickNext()}
            />
          </Space.Compact>
        )}
        <Button
          size="large"
          shape="circle"
          className="footer-controls__toggle"
          onClick={toggleCollapse}
          aria-label={isCollapsed ? "Développer le footer" : "Réduire le footer"}
          icon={
            <Icon
              icon={
                isCollapsed
                  ? "material-symbols:keyboard-arrow-up-rounded"
                  : "material-symbols:close-rounded"
              }
            />
          }
        />
      </div>
    </Layout.Footer>
  );
};
