package com.skillsphere.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skill_needed")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillNeeded {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;
}
