// Libraries
import app from "../../app";
import request from "supertest";

// Utils
import { deleteAllData } from "../../utils/tests/general";

// Components

// types

type DataDelete = { movies: string[]; series: string[] };

describe("teste com as midias", () => {
  const dataDelete: DataDelete = { movies: [], series: [] };

  afterAll(() => {
    deleteAllData("movies", "idAPI", dataDelete.movies);
    deleteAllData("series", "idAPI", dataDelete.series);
  });

  describe("get /medias", () => {
    it("Listando midias", async () => {
      const response = await request(app).get("/medias");

      expect(response.body.msg).toBe(
        "Aqui estão todos nossos filmes e séries!",
      );
      expect(response.statusCode).toBe(200);
      expect(response.body.data).toHaveProperty("movies");
      expect(response.body.data).toHaveProperty("series");
    });
  });

  describe("get /medias/:id", () => {
    const movie = {
      id: "tt13287846",
      APIName: "imdb",
      type: "movie",
    };

    const serie = {
      id: "tt2306299",
      APIName: "imdb",
      type: "tv",
    };

    beforeAll(async () => {
      await request(app).post("/medias").send(movie);
      await request(app).post("/medias").send(serie);
      dataDelete["movies"].push(`'${movie.id}'`);
      dataDelete["series"].push(`'${serie.id}'`);
    });

    it("procurando sem id", async () => {
      const response = await request(app).get(`/medias/find?id=&type=movie`);

      expect(response.body.msg).toBe("Não conseguimos encontrar");
      expect(response.body.type).toBe("id");
    });

    it("procurando sem type", async () => {
      const response = await request(app).get(`/medias/find?id=tt2306299&type=`);

      expect(response.body.msg).toBe("Não conseguimos encontrar");
      expect(response.body.type).toBe("type");
    });

    it("procurando com type errado", async () => {
      const response = await request(app).get(
        `/medias/find?id=tt2306299&type=test`,
      );

      expect(response.body.msg).toBe("Não conseguimos encontrar");
      expect(response.body.type).toBe("type");
    });

    it("procurando com id que nao existe", async () => {
      const response = await request(app).get(`/medias/find?id=test&type=test`);

      expect(response.body.msg).toBe("Não conseguimos encontrar");
    });

    it("procurando movie", async () => {
      const response = await request(app).get(
        `/medias/find?id=${movie.id}&type=movie`,
      );

      expect(response.body.msg).toBe("Aqui estão o filme ou série.");
      expect(response.body.data).toHaveProperty("id");
    });

    it("procurando serie", async () => {
      const response = await request(app).get(
        `/medias/find?id=${serie.id}&type=tv`,
      );

      expect(response.body.msg).toBe("Aqui estão o filme ou série.");
      expect(response.body.data).toHaveProperty("id");
    });
  });
  describe("post /medias", () => {
    it("id aleatorio com tmdb", async () => {
      const media = {
        id: "awdawdwa",
        type: "movie",
        APIName: "tmdb",
      };
      const response = await request(app).post(`/medias`).send(media);

      expect(response.body.msg).toBe("Midia não encontrada");
      expect(response.statusCode).toBe(404);
    });
    it("id aleatorio com imdb", async () => {
      const media = {
        id: "awdawdwa",
        type: "movie",
        APIName: "imdb",
      };
      const response = await request(app).post(`/medias`).send(media);

      expect(response.body.msg).toBe("Midia não encontrada");
      expect(response.statusCode).toBe(404);
    });
    it("serie encontrada no tmdb", async () => {
      const media = {
        id: "116135",
        type: "tv",
        APIName: "tmdb",
      };
      dataDelete["series"].push(`'${media.id}'`);

      const response = await request(app).post(`/medias`).send(media);

      expect(response.body.msg).toBe("Obra encontado com sucesso no TMDB");
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data).toHaveProperty("seasons");
      expect(response.statusCode).toBe(200);
    });
    it("movie encontrada no imdb", async () => {
      const media = {
        id: "tt15239678",
        type: "movie",
        APIName: "imdb",
      };
      dataDelete["movies"].push(`'${media.id}'`);

      const response = await request(app).post(`/medias`).send(media);

      expect(response.body.msg).toBe("Obra encontado com sucesso no TMDB");
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data).toHaveProperty("duration");
      expect(response.statusCode).toBe(200);
    });
    it("movie encontrada no imdb", async () => {
      const media = {
        id: "tt2442560",
        type: "tv",
        APIName: "imdb",
      };
      dataDelete["series"].push(`'${media.id}'`);
      const response = await request(app).post(`/medias`).send(media);

      expect(response.body.msg).toBe("Obra encontado com sucesso no TMDB");
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data).toHaveProperty("seasons");
      expect(response.statusCode).toBe(200);
    });
    it("obra encontrada já no banco de dados", async () => {
      const first_media = {
        id: "tt2861424",
        type: "tv",
        APIName: "imdb",
      };
      dataDelete["series"].push(`'${first_media.id}'`);
      await request(app).post(`/medias`).send(first_media);
      const response = await request(app).post(`/medias`).send(first_media);

      expect(response.body.msg).toBe("Obra encontado com sucesso no DB");
      expect(response.body.data).toHaveProperty("id");
      expect(response.statusCode).toBe(200);
    });
  });
});
