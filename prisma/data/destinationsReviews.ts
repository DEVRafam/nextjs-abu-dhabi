import type { SeederDataList, DestinationReview } from "./@types";
import faker from "faker";

const randomNumber = (): number => {
    const result = faker.datatype.number({
        min: 0,
        max: 10,
        precision: 0.1,
    });
    return result > 5
        ? result
        : faker.datatype.number({
              min: 0,
              max: 10,
              precision: 0.1,
          });
};
const randomComment = (): string => faker.lorem.sentences(3).slice(0, 100);

export default ((): SeederDataList<DestinationReview> => {
    const result: Partial<DestinationReview>[] = [];
    const DESTINATIONS = ["KRAKOW", "WARSZAWA", "VANCOUVER", "RIO_DE_JANEIRO"];

    DESTINATIONS.forEach((destination) => {
        result.push(
            {
                reviewerId: "1",
                destinationId: destination,
                points: randomNumber(),
                review: randomComment(),
            },
            {
                reviewerId: "2",
                destinationId: destination,
                points: randomNumber(),
                review: randomComment(),
            },
            {
                reviewerId: "3",
                destinationId: destination,
                points: randomNumber(),
                review: randomComment(),
            },
            {
                reviewerId: "4",
                destinationId: destination,
                points: randomNumber(),
                review: randomComment(),
            }
        );
    });

    return result;
})();
