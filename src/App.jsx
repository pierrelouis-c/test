import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Form,
  Spinner,
  Alert,
  Pagination,
} from "react-bootstrap";
import "./App.css";

// Use a Vite dev proxy (see vite.config.js) to avoid CORS issues
const API_URL = "/kaamelott/api/all";

function App() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 15;

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  const LIST_AUTEURS = [
    "Alexandre Astier",
    "Fabien Rault",
    "Lionnel Astier",
    "Nicolas Gabion",
  ];

  const [filters, setFilters] = useState({
    auteur: "",
    acteur: "",
    personnage: "",
    saison: "",
    episode: "",
  });

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Erreur API (${response.status})`);
        }

        const data = await response.json();

        const formattedCitations = data.citation.map((item, index) => {
          const infos = item.infos;
          return {
            id: item.id ?? index,
            citation: item.citation ?? item.quote ?? "",
            auteur: infos.auteur ?? item.auteur ?? "",
            acteur: infos.acteur ?? item.acteur ?? "",
            personnage: infos.personnage ?? item.personnage ?? "",
            saison: infos.saison ?? item.saison ?? "",
            episode: infos.episode ?? item.episode ?? "",
          };
        });

        setQuotes(formattedCitations);
      } catch (err) {
        setError(err.message || "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  const handleFilterChange = (field) => (event) => {
    const value = event.target.value;
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setCurrentPage(1);
  };

  const filteredQuotes = useMemo(() => {
    // pour gérer les majuscules
    const normalize = (value) =>
      value == null ? "" : String(value).toLowerCase();

    return quotes.filter((q) => {
      const auteur = normalize(q.auteur);
      const acteur = normalize(q.acteur);
      const personnage = normalize(q.personnage);
      const saison = normalize(q.saison);
      const episode = normalize(q.episode);

      const fAuteur = normalize(filters.auteur);
      const fActeur = normalize(filters.acteur);
      const fPersonnage = normalize(filters.personnage);
      const fSaison = normalize(filters.saison);
      const fEpisode = normalize(filters.episode);

      return (
        auteur.includes(fAuteur) &&
        acteur.includes(fActeur) &&
        personnage.includes(fPersonnage) &&
        saison.includes(fSaison) &&
        episode.includes(fEpisode)
      );
    });
  }, [quotes, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredQuotes.length / PAGE_SIZE));
  const paginatedQuotes = filteredQuotes.slice(startIndex, endIndex);

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <h1 className="mt-2 mb-0">Kaamelott - Citations</h1>
        </Col>
      </Row>

      <Row className="filters">
        <Col md={2} sm={6} className="mb-2">
          <Form.Select
            value={filters.auteur}
            onChange={handleFilterChange("auteur")}
            size="sm"
          >
            <option value="">Tous les auteurs</option>
            {LIST_AUTEURS.map((auteur) => (
              <option key={auteur} value={auteur}>
                {auteur}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2} sm={6} className="mb-2">
          <Form.Control
            placeholder="Acteur"
            value={filters.acteur}
            onChange={handleFilterChange("acteur")}
            size="sm"
          />
        </Col>
        <Col md={2} sm={6} className="mb-2">
          <Form.Control
            placeholder="Personnage"
            value={filters.personnage}
            onChange={handleFilterChange("personnage")}
            size="sm"
          />
        </Col>
        <Col md={2} sm={6} className="mb-2">
          <Form.Control
            placeholder="Saison"
            value={filters.saison}
            onChange={handleFilterChange("saison")}
            size="sm"
          />
        </Col>
        <Col md={2} sm={6} className="mb-2">
          <Form.Control
            placeholder="Épisode"
            value={filters.episode}
            onChange={handleFilterChange("episode")}
            size="sm"
          />
        </Col>
      </Row>

      {loading && (
        <Row className="mt-3">
          <Col className="d-flex justify-content-center">
            <Spinner
              animation="border"
              role="status"
              size="sm"
              className="me-2"
            />
            <span>Chargement des citations...</span>
          </Col>
        </Row>
      )}

      {error && (
        <Row className="mt-3">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      {!loading && !error && (
        <>
          <Row className="mt-3">
            <Col>
              <div className="table-container">
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Auteur</th>
                      <th>Acteur</th>
                      <th>Personnage</th>
                      <th>Saison</th>
                      <th>Épisode</th>
                      <th>Citation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedQuotes.map((q) => (
                      <tr
                        key={`${q.saison}-${q.episode}-${q.citation?.slice(0, 20)}`}
                      >
                        <td>{q.auteur || "-"}</td>
                        <td>{q.acteur || "-"}</td>
                        <td>{q.personnage || "-"}</td>
                        <td>{q.saison || "-"}</td>
                        <td>{q.episode || "-"}</td>
                        <td>{q.citation}</td>
                      </tr>
                    ))}
                    {filteredQuotes.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center">
                          Aucune citation ne correspond aux filtres.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
          {filteredQuotes.length > 0 && (
            <Row className="mt-2">
              <Col className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Affichage {startIndex + 1}–
                  {Math.min(endIndex, filteredQuotes.length)} sur{" "}
                  {filteredQuotes.length} citations
                </small>
                {totalPages > 1 && (
                  <Pagination size="sm" className="quotes-pagination mb-0">
                    <Pagination.First
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    />
                    {Array.from({ length: totalPages }, (_, index) => {
                      const page = index + 1;
                      return (
                        <Pagination.Item
                          key={page}
                          active={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Pagination.Item>
                      );
                    })}
                    <Pagination.Next
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                )}
              </Col>
            </Row>
          )}
        </>
      )}
    </Container>
  );
}

export default App;
