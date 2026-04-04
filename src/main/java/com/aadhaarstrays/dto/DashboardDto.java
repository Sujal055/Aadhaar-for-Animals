package com.aadhaarstrays.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardDto {
    private long totalAnimals;
    private long vaccinatedCount;
    private long sterilizedCount;
    private long criticalCount;
    private long moderateCount;
    private long stableCount;
    private long dogCount;
    private long catCount;
    private long cowCount;
    private long otherCount;
    private long activeCases;
    private long activeVolunteers;
    private long totalRescues;
    private long unreadNotifications;
    private double vaccinationPercent;

    // For pie chart
    private List<Map<String, Object>> pieData;

    // Recent activity feed
    private List<Map<String, String>> recentActivity;
}
