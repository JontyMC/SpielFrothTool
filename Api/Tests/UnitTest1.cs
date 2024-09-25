using HtmlAgilityPack;
using Shouldly;
using SpielFrothToolApi;

namespace Tests
{
    public class UnitTest1
    {
        [Fact]
        public void Test1()
        {
            var doc = new HtmlDocument();
            var userId = "asd";
            doc.Load("data.txt");
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
                    return new HttpGetData.Game("", bggId, bggUrl, name, publisher, priority, "", boothId, src, price);
                })
                .SelectMany(x =>
                    x.BoothId.Split(", ").Select(y =>
                        x with { Id = $"{userId}_{y}_{x.BggId}", HallId = y[0].ToString(), BoothId = y }))
                .ToArray();

            games.Length.ShouldBe(2);
        }
    }
}
