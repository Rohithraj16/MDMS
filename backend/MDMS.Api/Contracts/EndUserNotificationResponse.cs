namespace MDMS.Api.Contracts;

public sealed record EndUserNotificationResponse(
    string Id,
    string Type,
    string Title,
    string Message,
    DateTimeOffset CreatedAt,
    bool IsRead
);
