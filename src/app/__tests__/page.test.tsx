import { render, screen } from '@testing-library/react';
import Home from '../app/page';

describe('Home page', () => {
  it('should render the main heading', () => {
    render(<Home />);
    const heading = screen.getByText(/AI-Powered/i);
    expect(heading).toBeInTheDocument();
  });

  it('should render the feature cards', () => {
    render(<Home />);
    const featureCards = screen.getAllByText(/Automatically identify potential anomalies/i);
    expect(featureCards.length).toBeGreaterThan(0);
  });

  it('should render the Animated3DViewer component', () => {
    render(<Home />);
    const viewer = screen.getByText(/Coronal View/i);
    expect(viewer).toBeInTheDocument();
  });

  it('should render the AICompanionUI component', () => {
    render(<Home />);
    const companion = screen.getByText(/Hello! I'm your AI Health Companion./i);
    expect(companion).toBeInTheDocument();
  });
});
