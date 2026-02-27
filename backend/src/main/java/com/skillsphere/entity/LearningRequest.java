package com.skillsphere.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "learning_request")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "learner_id", nullable = false)
    private User learner;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mentor_id", nullable = false)
    private User mentor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    // PENDING / ACCEPTED / REJECTED
    @Column(nullable = false)
    private String status;
}
