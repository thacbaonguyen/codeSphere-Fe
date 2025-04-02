import { CourseReview } from "./course-review";
import { Section } from "./section";

export interface CourseDetail {
    id: number,
    title: string,
    description: string,
    thumbnail: string,
    createdAt: string,
    duration: number,
    rating: number,
    sectionCount: number,
    videoCount: number,
    category: string,
    image: string,
    courseReviews: CourseReview[],
    sections: Section[],
}
