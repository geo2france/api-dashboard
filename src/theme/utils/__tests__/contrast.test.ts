import { contrastRatio, pickAccessibleForeground, WCAG_CONTRAST } from '../contrast';

describe('contrastRatio', () => {
  test('noir sur blanc = contraste maximal (~21)', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
  });

  test('le vert de marque échoue sur blanc, passe sur fond sombre', () => {
    expect(contrastRatio('#95c11f', '#ffffff')).toBeLessThan(WCAG_CONTRAST.UI);
    expect(contrastRatio('#95c11f', '#141414')).toBeGreaterThanOrEqual(WCAG_CONTRAST.TEXT);
  });

  test('couleur invalide → retourne 1 (pire cas) sans throw', () => {
    expect(contrastRatio('not-a-color', '#fff')).toBe(1);
  });
});

describe('pickAccessibleForeground', () => {
  const fallback = '#1f1f1f'; // neutre foncé (≈ colorText light)

  test('conserve le candidat quand il atteint le seuil', () => {
    // #0046AD sur blanc : contraste élevé → conservé
    expect(pickAccessibleForeground('#0046AD', '#ffffff', fallback, WCAG_CONTRAST.TEXT)).toBe('#0046AD');
  });

  test('retombe sur le fallback quand le candidat échoue', () => {
    // #95c11f sur blanc : 2.12 < 4.5 → fallback
    expect(pickAccessibleForeground('#95c11f', '#ffffff', fallback, WCAG_CONTRAST.TEXT)).toBe(fallback);
  });

  test('le seuil UI (3) est plus permissif que le seuil TEXT (4.5)', () => {
    // #1677ff sur blanc ≈ 4.10 : passe UI (≥3) mais échoue TEXT (<4.5)
    const bg = '#ffffff';
    const candidate = '#1677ff';
    expect(pickAccessibleForeground(candidate, bg, fallback, WCAG_CONTRAST.TEXT)).toBe(fallback);
    expect(pickAccessibleForeground(candidate, bg, fallback, WCAG_CONTRAST.UI)).toBe(candidate);
  });
});
