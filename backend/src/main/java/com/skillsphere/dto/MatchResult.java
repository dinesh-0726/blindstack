package com.skillsphere.dto;

import com.skillsphere.entity.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MatchResult {
    private User mentor;
    private Skill skill;
    private String level;
}
