using System.Threading.Tasks;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public interface IProAgilRepository
    {
         void Add<T>(T entity) where T : class;
         void Update<T>(T entity) where T : class;
         void Delete<T>(T entity) where T : class;
         Task<bool> SaveChangesAsync();

        //Eventos
        Task<Evento[]> GetAllEventoAsyncByTema(string tema, bool includePalestrante);
        Task<Evento[]> GetAllEventoAsync(bool includePalestrante);
        Task<Evento> GetAllEventoAsyncById(int EventoId, bool includePalestrante);

        //PALESTRANTE
        Task<Palestrante[]> GetAllPalestrantesAsyncByName(string name, bool includeEventos);
        Task<Palestrante> GetPalestranteAsync(int PalestranteId, bool includeEventos);
    }
}