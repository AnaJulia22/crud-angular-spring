package com.crud.crudspring;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.crud.crudspring.enums.Category;
import com.crud.crudspring.model.Course;
import com.crud.crudspring.model.Lesson;
import com.crud.crudspring.repository.CourseRepository;

@SpringBootApplication
public class CrudSpringApplication {

	public static void main(String[] args) {
		SpringApplication.run(CrudSpringApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(CourseRepository courseRepository) {
		return args -> {
			courseRepository.deleteAll();

			for (int i=0; i<20; i++){

				Course c = new Course();

				c.setName("Angular com Spring " + i);
				c.setCategory(Category.FRONT_END);

				Lesson l = new Lesson();

				l.setName("Introdução");
				l.setYoutubeUrl("watch?v=N2");
				l.setCourse(c);
				c.getLessons().add(l);

				Lesson l2 = new Lesson();

				l2.setName("Angular");
				l2.setYoutubeUrl("watch?v=22");
				l2.setCourse(c);
				c.getLessons().add(l2);

				courseRepository.save(c);
			}
		};
	}

}
