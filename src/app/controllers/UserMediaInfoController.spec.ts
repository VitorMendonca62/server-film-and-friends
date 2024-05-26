import {app} from "../../app";
import request from "supertest";

import { deleteAllData } from "../../utils/tests/general";
import User from "../../database/models/User.model";
import UserMediaInfo from "../../database/models/UserMediaInfo.model";

const dataDeleteMovies: string[] = [];
const dataDeleteUsersMedia: string[] = [];
const dataDeleteUsers: string[] = [];

async function createBasicSetup(
  user: IUserBasicInputcSchema,
  media: IMediaInput,
) {
  await request(app).post("/users").send(user);
  dataDeleteUsers.push(`'${user.email}'`);

  const userData = await User.findOne({ where: { email: user.email } });
  const userId = userData?.id as string;

  const response = await request(app).post("/medias").send(media);
  console.log(response.body)
  const mediaId = response.body.data.id;
  dataDeleteMovies.push(`'${media.id}'`);

  await request(app).post("/infos").send({
    userId,
    mediaId,
    rating: 3,
    type: "rating",
  });
  dataDeleteUsersMedia.push(`'${userId}'`);

  return [mediaId, userId];
}

describe("Test in /infos", () => {
  afterAll(async () => {
    deleteAllData("movies", "idAPI", dataDeleteMovies);
    deleteAllData("users_media_info", "userId", dataDeleteUsersMedia);
    deleteAllData("users", "email", dataDeleteUsers);
  });

  describe("get /:type/:id", () => {
    let mediaIdGeneral = "";
    let userIdGeneral = "";

    beforeAll(async () => {
      const user = {
        name: "felipe calegario",
        username: "fmmcadwad",
        email: "felipinho123@cin.ufpe.br",
        password: "criatividade",
      };

      const media: IMediaInput = {
        id: "929590",
        APIName: "tmdb",
        type: "movie",
      };
      [mediaIdGeneral, userIdGeneral] = await createBasicSetup(user, media);
    });

    it("deve retornar not found", async () => {
      const response = await request(app).get("/infos/dadw/dawda");

      expect(response.body.msg).toBe("Não conseguimos encontrar!");
      expect(response.statusCode).toBe(404);
    });

    it("deve retornar not found com type aleatorio", async () => {
      const response = await request(app).get(`/infos/dadw/${userIdGeneral}`);

      expect(response.body.msg).toBe("Não conseguimos encontrar!");
      expect(response.statusCode).toBe(404);
    });

    it("deve retornar not found vom id aleatorio", async () => {
      const response = await request(app).get("/infos/user/userawfwa");

      expect(response.body.msg).toBe("Não conseguimos encontrar!");
      expect(response.statusCode).toBe(404);
    });

    it("deve retornar not found vom id aleatorio", async () => {
      const response = await request(app).get("/infos/user/userawfwa");

      expect(response.body.msg).toBe("Não conseguimos encontrar!");
      expect(response.statusCode).toBe(404);
    });
    it("deve retornar todas as informações do user", async () => {
      const response = await request(app).get(`/infos/user/${userIdGeneral}`);

      expect(response.body.msg).toBe("Aqui está todas as informações");
      expect(response.statusCode).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it("deve retornar todas as informações do midia", async () => {
      const response = await request(app).get(`/infos/media/${mediaIdGeneral}`);

      expect(response.body.msg).toBe("Aqui está todas as informações");
      expect(response.statusCode).toBe(200);
      expect(response.body.data.length).toBe(1);
    });
  });

  describe("post in /infos", () => {
    let mediaIdGeneral = "";
    let userIdGeneral = "";

    beforeAll(async () => {
      const user = {
        name: "Pedro Manhaes",
        username: "pmmc12324242",
        email: "pmmc@cin.ufpe.br",
        password: "matematica discreta :)",
      };

      const media: IMediaInput = {
        id: "1019317",
        APIName: "tmdb",
        type: "movie",
      };
      [mediaIdGeneral, userIdGeneral] = await createBasicSetup(user, media);
    });

    it("deve colocar um mediaid aleatorio", async () => {
      const response = await request(app).post(`/infos`).send({
        userId: userIdGeneral,
        mediaId: "71c5ce3b-65de-4f9c-b72f-5fd23b9ec700",
        type: "rating",
        rating: 3,
      });

      expect(response.body.msg).toBe("Não conseguimos encontrar!");
      expect(response.statusCode).toBe(404);
    });

    it("deve colocar um userid aleatorio", async () => {
      const response = await request(app).post(`/infos`).send({
        userId: "71c5ce3b-65de-4f9c-b72f-5fd23b9ec700",
        mediaId: mediaIdGeneral,
        type: "rating",
        rating: 3,
      });

      expect(response.body.msg).toBe("Não conseguimos encontrar!");
      expect(response.statusCode).toBe(404);
    });
// AQUI
    it("deve avaliar sem ser avaliado", async () => {
      async function takeIDs() {
        const user = {
          name: "Sergio Branco",
          username: "sergiobranco",
          email: "sergiocastelobranco@cin.ufpe.br",
          password: "programacao1",
        };

        const media: IMediaInput = {
          id: "1105407",
          APIName: "tmdb",
          type: "movie",
        };
        return await createBasicSetup(user, media);
      }

      const [mediaId, userId] = await takeIDs();

      const response = await request(app).post(`/infos`).send({
        userId,
        mediaId,
        type: "rating",
        rating: "1",
      });
      expect(response.body.msg).toBe("A mídia foi avaliada");
      expect(response.statusCode).toBe(201);
    });

    // AQUI
    it("deve favoritar ", async () => {
      async function takeIDs() {
        const user = {
          name: "SVitor HUgo",
          username: "test1234",
          email: "rtwfwafd@cin.ufpe.br",
          password: "programacao1",
        };

        const media: IMediaInput = {
          id: "126308",
          APIName: "tmdb",
          type: "movie",
        };
        return await createBasicSetup(user, media);
      }

      const [mediaId, userId] = await takeIDs();

      const response = await request(app).post(`/infos`).send({
        userId,
        mediaId,
        type: "favorite",
        rating: 1,
      });
      expect(response.body.msg).toBe("A mídia foi favoritada");
      expect(response.statusCode).toBe(201);

      const infos = await UserMediaInfo.findOne({
        where: { userId, mediaId },
      });
      expect(infos != null).toBe(true);
      if (infos != null) {
        expect(infos.rating).toBe(1);
      }
    });

    it("deve avaliar já avaliado", async () => {
      await request(app).post(`/infos`).send({
        userId: userIdGeneral,
        mediaId: mediaIdGeneral,
        type: "rating",
        rating: 5,
      });

      const infosOrtherRating = await UserMediaInfo.findOne({
        where: { userId: userIdGeneral, mediaId: mediaIdGeneral },
      });
      expect(infosOrtherRating != null).toBe(true);
      if (infosOrtherRating != null) {
        expect(infosOrtherRating.rating).toBe(5);
      }
    });

    it("deve favoritar já avaliado", async () => {
      await request(app).post(`/infos`).send({
        userId: userIdGeneral,
        mediaId: mediaIdGeneral,
        type: "favorite",
        favorite: "1",
      });

      const infos = await UserMediaInfo.findOne({
        where: { userId: userIdGeneral, mediaId: mediaIdGeneral },
      });
      expect(infos != null).toBe(true);
      if (infos != null) {
        expect(infos.rating).toBe(5);
        expect(infos.favorite).toBe(true);
      }
    });

    it("deve avaliar já favoritado", async () => {
      async function takeIDs() {
        const user = {
          name: "awdawd",
          username: "dwadawd",
          email: "daawdawdada@cin.ufpe.br",
          password: "dawdawdad",
        };

        const media: IMediaInput = {
          id: "1041613",
          APIName: "tmdb",
          type: "movie",
        };
        return await createBasicSetup(user, media);
      }

      const [mediaId, userId] = await takeIDs();

      await request(app).post(`/infos`).send({
        userId,
        mediaId,
        type: "favorite",
        favorite: "1",
      });

      const response = await request(app).post(`/infos`).send({
        userId,
        mediaId,
        type: "rating",
        favorite: "1",
      });

      expect(response.body.msg).toBe("A mídia foi avaliada");
      expect(response.body.statusCode).toBe(201);

      const infos = await UserMediaInfo.findOne({
        where: { userId, mediaId },
      });
      expect(infos != null).toBe(true);

      if (infos != null) {
        expect(infos.rating).toBe(1);
        expect(infos.favorite).toBe(true);
      }
    });
  });
});
