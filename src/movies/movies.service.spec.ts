import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("getAll()", () => {
    it("should return an array", () => {
      const result = service.getAll()
      expect(result).toBeInstanceOf(Array)
    })
  })

  describe("getOne", () => {
    it("should return a movie", () => {
      service.create({
        title: "TestMovie",
        year: 2020,
        genres: ["dhkdn", "dkjd"],
      })
      const movie = service.getOne(1)
      expect(movie).toBeDefined()
      expect(movie.id).toEqual(1)
    })

    it("should throw 404 error", () => {
      try {
        service.getOne(999)
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException)
        expect(e.message).toEqual('Movie with ID 999 not found!')
      }
    })
  })

  describe("deleteOne()", () => {
    it("deletes a movie", () => {
      service.create({
        title: "TestMovie",
        year: 2020,
        genres: ["dhkdn", "dkjd"],
      })
      const allMovies = service.getAll().length
      service.deleteOne(1)
      const afterDelete = service.getAll().length

      expect(afterDelete).toBeLessThan(allMovies)
    })

    it("should return a 404", () => {
      try {
        service.deleteOne(888)
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException)
      }
    })
  })

  describe("create()", () => {
    it("should create a movie", () => {
      const beforeCreate = service.getAll().length
      service.create({
        title: "TestMovie",
        year: 2020,
        genres: ["dhkdn", "dkjd"],
      })
      const afterCreate = service.getAll().length

      expect(afterCreate).toBeGreaterThan(beforeCreate)
    })
  })

  describe("update()", () => {
    it("should be update movie", () => {
      service.create({
        title: "TestMovie",
        year: 2020,
        genres: ["dhkdn", "dkjd"],
      })

      service.update(1, {
        title: "UpdateMovie"
      })
      const movie = service.getOne(1)
      expect(movie.title).toEqual("UpdateMovie")
    })

    it("should return a 404", () => {
      try {
        service.update(888, {})
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException)
      }
    })
  })

});
