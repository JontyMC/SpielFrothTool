using HtmlAgilityPack;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options => options.AddDefaultPolicy(
    policy => policy.WithOrigins("http://localhost:5173").AllowAnyMethod()
        .AllowAnyHeader()));

var app = builder.Build();

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseCors();
app.MapFallbackToFile("/index.html");

app.MapGet("/api/data/{userId}", (string userId) =>
{
    var url = $"https://tabletoptogether.com/tool/share.php?key={userId}&c=29";
    var web = new HtmlWeb();
    var doc = web.Load(url);
    var games = doc.DocumentNode.SelectNodes("//tr").Skip(1)
        .Select(node =>
        {
            var tds = node.ChildNodes.Where(x => x.Name == "td").ToArray();
            var anchor = tds[0].ChildNodes.First(x => x.Name == "a");
            var bggUrl = anchor.GetAttributeValue("href", "");
            var src = anchor.ChildNodes.First(x => x.Name == "img").GetAttributeValue("src", "");
            var bggId = bggUrl.Split('/').Last();
            var className = node.GetAttributeValue("class", "");
            var priority = className switch
            {
                "success" => "need",
                "info" => "want",
                _ => "like"
            };
            var name = tds[1].ChildNodes.First(x => x.Name == "strong").InnerText;
            var publisherSmall = tds[1].ChildNodes.FindFirst("small");
            var publisher = publisherSmall.ChildNodes.First(x => x.Name == "a").InnerText;
            var publisherText = publisherSmall.ChildNodes[2].InnerText;
            var boothId = publisherText[2..publisherText.IndexOf(')')].TrimStart('-');
            var price = tds[1].ChildNodes.FirstOrDefault(x => x.InnerText.StartsWith("&euro;"))?.InnerText ??
                        "";
            return new Game("", bggId, bggUrl, name, publisher, priority, "", boothId, src, price);
        })
        .SelectMany(x =>
            x.BoothId.Split(", ").Select(y =>
                x with { Id = $"{userId}_{y}_{x.BggId}", HallId = y[0].ToString(), BoothId = y }))
        .ToArray();

    return games;
});

app.Run();

public record Game(
    string Id,
    string BggId,
    string Url,
    string Name,
    string Publisher,
    string Priority,
    string HallId,
    string BoothId,
    string Src,
    string Price);
