/* ── Pattern content data ───────────────────────────────────────────── */

const PATTERNS = {

  /* ══════════════ CREATIONAL ══════════════ */

  'singleton': {
    id: 'singleton', name: 'Singleton', category: 'creational', difficulty: 'beginner',
    readingTime: 6,
    summary: 'Ensure a class has only one instance and provide a global access point to it.',
    intent: 'Ensure a class has only one instance, and provide a global point of access to it.',
    problemDescription: `Many components in a system need access to a shared resource — a configuration manager, a thread pool, a logger, or a database connection pool. If every class creates its own instance, you end up with wasted memory, inconsistent state, and race conditions.`,
    problemCode: `// Without Singleton — every caller creates its own instance
class App {
    void run() {
        ConfigManager config = new ConfigManager(); // new instance every time
        Logger logger = new Logger();               // another separate instance
    }
}`,
    solutionDescription: `The Singleton pattern restricts instantiation to a single object. The class itself controls creation, stores the instance internally, and exposes it through a static method.`,
    solutionDiagram: `Client ──► Singleton.getInstance()
                              │
                    ┌─────────▼──────────┐
                    │     Singleton      │
                    │  - instance: self  │
                    │  + getInstance()   │
                    │  + operation()     │
                    └────────────────────┘`,
    implementationCode: { java: `public class LazySingleton {
    private static LazySingleton instance;

    private LazySingleton() { }

    public static LazySingleton getInstance() {
        if (instance == null) {
            instance = new LazySingleton();
        }
        return instance;
    }
}

// Thread-safe version (Double-Checked Locking)
public class ThreadSafeSingleton {
    private static volatile ThreadSafeSingleton instance;

    private ThreadSafeSingleton() { }

    public static ThreadSafeSingleton getInstance() {
        if (instance == null) {
            synchronized (ThreadSafeSingleton.class) {
                if (instance == null) {
                    instance = new ThreadSafeSingleton();
                }
            }
        }
        return instance;
    }
}` },
    useWhen: [
      'Exactly one instance must exist and be accessible globally',
      'Shared resources like connection pools, caches, or logging systems',
      'Coordinating actions across the system from a single control point',
    ],
    avoidWhen: [
      'You need multiple independent instances (use dependency injection instead)',
      'Testing is important — Singletons make mocking difficult',
      'The class has mutable state shared across threads without careful synchronization',
    ],
    realWorld: [
      { name: 'Java Runtime', description: 'Runtime.getRuntime() returns the same JVM runtime instance.' },
      { name: 'Spring Beans', description: 'Spring beans are singletons by default within the application context.' },
      { name: 'Logger', description: 'Logger.getLogger("name") returns the same logger instance per name.' },
    ],
    related: ['factory-method', 'abstract-factory'],
    takeaways: [
      'Guarantees a single instance and global access.',
      'Double-checked locking is required for thread safety in lazy initialization.',
      'Enum-based Singleton is the safest and most concise Java implementation.',
      'Prefer dependency injection over Singleton in modern applications.',
    ],
    hasRepoCode: true,
    repoPath: 'src/main/java/org/patidar/creationalPattern/singleton/sample',
  },

  'factory-method': {
    id: 'factory-method', name: 'Factory Method', category: 'creational', difficulty: 'beginner',
    readingTime: 8,
    summary: 'Define an interface for creating objects, but let subclasses decide which class to instantiate.',
    intent: 'Define an interface for creating an object, but let subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses.',
    problemDescription: `Imagine building a notification system. You need to send Email, SMS, and Push notifications. If you write the sending logic directly in your service class, it becomes tightly coupled to concrete classes. Adding a new notification type requires modifying existing code — violating the Open/Closed principle.`,
    problemCode: `// Tightly coupled — must modify this class for every new type
class NotificationService {
    Notification create(String type) {
        if (type.equals("EMAIL")) return new EmailNotification();
        if (type.equals("SMS"))   return new SMSNotification();
        // Adding Push requires editing this class
        throw new IllegalArgumentException("Unknown type");
    }
}`,
    solutionDescription: `Extract object creation into a factory method. Each concrete creator overrides the factory method to produce the right product. The client code works against the abstract creator — it never knows or cares which concrete class is instantiated.`,
    solutionDiagram: `    NotificationService (abstract)
       + send()
       + create(): Notification  ← factory method
              ▲
    ┌─────────┴──────────┐
    │                    │
EmailNotificationService  SMSNotificationService
+ create(): Email      + create(): SMS`,
    implementationCode: { java: `// Abstract product
public interface Notification {
    void send(String message);
}

// Abstract creator
public abstract class NotificationService {
    public void notify(String message) {
        Notification n = create(); // call factory method
        n.send(message);
    }
    protected abstract Notification create();
}

// Concrete creator
public class EmailNotificationService extends NotificationService {
    @Override
    protected Notification create() {
        return new EmailNotification();
    }
}

// Concrete product
public class EmailNotification implements Notification {
    @Override
    public void send(String message) {
        System.out.println("Email: " + message);
    }
}` },
    useWhen: [
      'A class cannot anticipate the class of objects it must create',
      'You want subclasses to specify the objects they create',
      'You want to localize knowledge of which concrete class gets created',
    ],
    avoidWhen: [
      'The class hierarchy becomes deep just to support creation logic',
      'Object creation logic is trivial and stable',
    ],
    realWorld: [
      { name: 'java.util.Calendar', description: 'Calendar.getInstance() returns a concrete subclass based on locale.' },
      { name: 'JDBC', description: 'DriverManager.getConnection() returns the right Connection type per driver.' },
      { name: 'Spring', description: 'BeanFactory creates beans based on configuration, hiding concrete types.' },
    ],
    related: ['abstract-factory', 'template-method', 'prototype'],
    takeaways: [
      'Decouples the creator from the concrete product.',
      'Adding new products means adding new subclasses, not changing existing code.',
      'Often used alongside Template Method — the factory method is a hook.',
      'The client code works through the abstract interface.',
    ],
    hasRepoCode: true,
    repoPath: 'src/main/java/org/patidar/creationalPattern/factoryMethod',
  },

  'abstract-factory': {
    id: 'abstract-factory', name: 'Abstract Factory', category: 'creational', difficulty: 'intermediate',
    readingTime: 10,
    summary: 'Provide an interface for creating families of related objects without specifying their concrete classes.',
    intent: 'Provide an interface for creating families of related or dependent objects without specifying their concrete classes.',
    problemDescription: `Your application supports multiple UI themes: Light and Dark. Each theme provides its own Button, TextField, and Dialog. If you create these components directly, the theme becomes scattered across the codebase and mixing components from different themes becomes possible.`,
    problemCode: `// Without Abstract Factory — theme logic scattered everywhere
class App {
    void render(String theme) {
        Button btn;
        if (theme.equals("dark")) btn = new DarkButton();
        else btn = new LightButton();
        // Repeated for every component — error prone
    }
}`,
    solutionDescription: `An abstract factory declares creation methods for each product type. Concrete factories implement the abstract factory for a specific family. The client only talks to the abstract factory — it gets a consistent, compatible family of objects.`,
    solutionDiagram: `        UIFactory (abstract)
        + createButton()
        + createTextField()
               ▲
    ┌──────────┴──────────┐
    │                     │
LightUIFactory        DarkUIFactory
+ createButton()    + createButton()
  → LightButton       → DarkButton`,
    implementationCode: { java: `public interface UIFactory {
    Button createButton();
    TextField createTextField();
}

public class DarkUIFactory implements UIFactory {
    @Override public Button createButton() { return new DarkButton(); }
    @Override public TextField createTextField() { return new DarkTextField(); }
}

public class LightUIFactory implements UIFactory {
    @Override public Button createButton() { return new LightButton(); }
    @Override public TextField createTextField() { return new LightTextField(); }
}

// Client never mentions concrete classes
public class App {
    private final UIFactory factory;

    public App(UIFactory factory) { this.factory = factory; }

    public void render() {
        Button btn = factory.createButton();
        TextField tf = factory.createTextField();
        btn.render();
    }
}` },
    useWhen: [
      'System needs to be independent of how its products are created',
      'System should work with multiple families of products',
      'A family of related products must be used together',
    ],
    avoidWhen: [
      'Product families are unlikely to change or expand',
      'Adding new product types requires changing the abstract factory (breaks OCP)',
    ],
    realWorld: [
      { name: 'javax.xml.parsers', description: 'DocumentBuilderFactory creates a family of XML parsing objects.' },
      { name: 'JDBC', description: 'Different database drivers provide families of Connection, Statement, ResultSet.' },
      { name: 'UI Toolkits', description: 'Swing\'s LookAndFeel creates families of consistent UI components.' },
    ],
    related: ['factory-method', 'singleton', 'prototype'],
    takeaways: [
      'Ensures product family consistency — you always get compatible objects.',
      'Isolates concrete classes from the client.',
      'Switching families means swapping one factory implementation.',
      'Adding a new product type to the family is hard — requires updating all factories.',
    ],
    hasRepoCode: false,
  },

  'builder': {
    id: 'builder', name: 'Builder', category: 'creational', difficulty: 'beginner',
    readingTime: 7,
    summary: 'Construct complex objects step by step, separating construction from representation.',
    intent: 'Separate the construction of a complex object from its representation so that the same construction process can create different representations.',
    problemDescription: `An HTTP request object has many optional fields: URL, method, headers, body, timeout, auth token. Using a constructor with many parameters is unreadable and error-prone. Overloaded constructors explode in count.`,
    problemCode: `// Telescoping constructor — hard to read, easy to mix up parameters
HttpRequest request = new HttpRequest(
    "https://api.example.com/users",
    "POST",
    headers,      // is this the 3rd or 4th param?
    body,
    30,
    null,
    true
);`,
    solutionDescription: `The Builder pattern provides a fluent API for constructing objects step by step. Each method sets one field and returns the builder itself, enabling method chaining. The final build() call validates and returns the completed object.`,
    solutionDiagram: `HttpRequest.Builder
  .url("...")
  .method("POST")
  .header("Content-Type", "application/json")
  .body("{...}")
  .timeout(30)
  .build()   ──► HttpRequest (immutable)`,
    implementationCode: { java: `public class HttpRequest {
    private final String url;
    private final String method;
    private final Map<String, String> headers;
    private final String body;
    private final int timeoutSeconds;

    private HttpRequest(Builder builder) {
        this.url = builder.url;
        this.method = builder.method;
        this.headers = Collections.unmodifiableMap(builder.headers);
        this.body = builder.body;
        this.timeoutSeconds = builder.timeoutSeconds;
    }

    public static class Builder {
        private final String url;          // required
        private String method = "GET";
        private Map<String, String> headers = new HashMap<>();
        private String body;
        private int timeoutSeconds = 30;

        public Builder(String url) { this.url = url; }

        public Builder method(String method) { this.method = method; return this; }
        public Builder header(String k, String v) { headers.put(k, v); return this; }
        public Builder body(String body) { this.body = body; return this; }
        public Builder timeout(int seconds) { this.timeoutSeconds = seconds; return this; }

        public HttpRequest build() {
            if (url == null || url.isBlank())
                throw new IllegalStateException("URL is required");
            return new HttpRequest(this);
        }
    }
}` },
    useWhen: [
      'Objects have many optional parameters',
      'You want to construct immutable objects step by step',
      'The same construction process should produce different representations',
    ],
    avoidWhen: [
      'Objects have only a few mandatory fields — a simple constructor suffices',
      'The object construction order doesn\'t matter',
    ],
    realWorld: [
      { name: 'StringBuilder', description: 'Java\'s StringBuilder builds a String incrementally.' },
      { name: 'OkHttp', description: 'OkHttp uses Builder for Request, Response, and OkHttpClient.' },
      { name: 'Lombok @Builder', description: 'Lombok generates a builder for any class with the annotation.' },
    ],
    related: ['factory-method', 'composite'],
    takeaways: [
      'Replaces telescoping constructors with a readable fluent API.',
      'The built object can be immutable — the builder holds mutable state, the product does not.',
      'Validate invariants in build() before constructing the object.',
      'Inner static Builder class is idiomatic Java.',
    ],
    hasRepoCode: true,
    repoPath: 'src/main/java/org/patidar/creationalPattern/builder/sample',
  },

  'prototype': {
    id: 'prototype', name: 'Prototype', category: 'creational', difficulty: 'intermediate',
    readingTime: 7,
    summary: 'Create new objects by cloning an existing instance rather than constructing from scratch.',
    intent: 'Specify the kinds of objects to create using a prototypical instance, and create new objects by copying this prototype.',
    problemDescription: `You have a complex object — a configured database connection, a detailed document template, or a pre-populated form — and you need multiple similar objects. Recreating them from scratch is expensive. You need an efficient way to copy them.`,
    problemCode: `// Expensive to recreate — all configuration repeated
DatabaseConfig config1 = new DatabaseConfig();
config1.setHost("localhost");
config1.setPort(5432);
config1.setPoolSize(10);
config1.setConnectionTimeout(30);
// ...20 more settings

// Need a second config — must repeat everything or risk missing a field
DatabaseConfig config2 = new DatabaseConfig();
config2.setHost("localhost"); // copy-paste prone to errors`,
    solutionDescription: `Implement the Cloneable interface (or a custom clone method) so objects can produce copies of themselves. The client asks a prototype to clone itself rather than knowing the object's concrete class.`,
    solutionDiagram: `Prototype (interface)
+ clone(): Prototype
       ▲
ConcretePrototype
+ clone() { return new ConcretePrototype(this); }

Client: Prototype copy = original.clone();`,
    implementationCode: { java: `public abstract class Shape implements Cloneable {
    protected String color;
    protected int x, y;

    public Shape(Shape source) {
        this.color = source.color;
        this.x = source.x;
        this.y = source.y;
    }

    @Override
    public abstract Shape clone();
}

public class Circle extends Shape {
    private int radius;

    public Circle(Circle source) {
        super(source);
        this.radius = source.radius;
    }

    @Override
    public Circle clone() {
        return new Circle(this);
    }
}

// Usage
Circle original = new Circle();
original.color = "red";
original.radius = 10;

Circle copy = original.clone(); // fast, no re-configuration
copy.color = "blue";            // original unaffected` },
    useWhen: [
      'Object creation is expensive and a similar object already exists',
      'You need copies of objects with slight variations',
      'Classes to instantiate are specified at runtime',
    ],
    avoidWhen: [
      'Objects have circular references — deep cloning becomes complex',
      'All fields are primitives or immutable — a simple copy constructor suffices',
    ],
    realWorld: [
      { name: 'Object.clone()', description: 'Java\'s built-in clone() mechanism implements Prototype.' },
      { name: 'Spring Prototype Scope', description: 'Spring\'s prototype bean scope returns a new copy per request.' },
      { name: 'Document Templates', description: 'Word processors clone template documents for new files.' },
    ],
    related: ['factory-method', 'abstract-factory', 'composite'],
    takeaways: [
      'Cloning is faster than construction when initialization is expensive.',
      'Prefer a copy constructor over Object.clone() in modern Java.',
      'Deep vs shallow copy matters — decide carefully for nested objects.',
      'A prototype registry stores ready-to-use prototypes keyed by name.',
    ],
    hasRepoCode: false,
  },

  /* ══════════════ STRUCTURAL ══════════════ */

  'adapter': {
    id: 'adapter', name: 'Adapter', category: 'structural', difficulty: 'beginner',
    readingTime: 7,
    summary: 'Convert the interface of a class into another interface that clients expect.',
    intent: 'Convert the interface of a class into another interface clients expect. Adapter lets classes work together that couldn\'t otherwise because of incompatible interfaces.',
    problemDescription: `You're integrating a third-party payment library. Its interface doesn't match your application's PaymentProcessor interface. You can't modify the third-party code. Your existing code expects a standard interface.`,
    problemCode: `// Your interface
interface PaymentProcessor {
    void processPayment(double amount, String currency);
}

// Third-party library you can't change
class StripeClient {
    void chargeCard(String cardToken, int amountCents, String currencyCode) { ... }
}

// These two can't work together directly`,
    solutionDescription: `The Adapter wraps the incompatible class, translating calls from the target interface into calls the adaptee understands. The client only sees the target interface.`,
    solutionDiagram: `Client ──► PaymentProcessor (interface)
                          ▲
                   StripeAdapter
                   - stripeClient: StripeClient
                   + processPayment(amount, currency)
                         │
                         ▼ translates to
                   StripeClient
                   + chargeCard(token, cents, code)`,
    implementationCode: { java: `public class StripeAdapter implements PaymentProcessor {
    private final StripeClient stripeClient;
    private final String cardToken;

    public StripeAdapter(StripeClient stripeClient, String cardToken) {
        this.stripeClient = stripeClient;
        this.cardToken = cardToken;
    }

    @Override
    public void processPayment(double amount, String currency) {
        int amountCents = (int) (amount * 100); // translate units
        stripeClient.chargeCard(cardToken, amountCents, currency.toLowerCase());
    }
}

// Client code — unchanged
PaymentProcessor processor = new StripeAdapter(new StripeClient(), token);
processor.processPayment(49.99, "USD");` },
    useWhen: [
      'You want to use an existing class but its interface is incompatible',
      'Integrating third-party libraries without modifying them',
      'You want reusable classes that cooperate with classes with incompatible interfaces',
    ],
    avoidWhen: [
      'You can change the class directly — a direct fix is simpler',
      'The translation logic is so complex it would be better to rewrite',
    ],
    realWorld: [
      { name: 'Arrays.asList()', description: 'Adapts an array to the List interface.' },
      { name: 'InputStreamReader', description: 'Adapts a byte stream (InputStream) to a character stream (Reader).' },
      { name: 'Spring MVC HandlerAdapter', description: 'Adapts various handler types to a uniform interface.' },
    ],
    related: ['facade', 'decorator', 'proxy'],
    takeaways: [
      'Adapter makes incompatible interfaces compatible without changing existing code.',
      'Object adapter (composition) is preferred over class adapter (inheritance) in Java.',
      'The client doesn\'t know it\'s talking to an adapter.',
      'Translation logic lives in one place — the adapter.',
    ],
    hasRepoCode: false,
  },

  'decorator': {
    id: 'decorator', name: 'Decorator', category: 'structural', difficulty: 'intermediate',
    readingTime: 9,
    summary: 'Attach additional responsibilities to an object dynamically without subclassing.',
    intent: 'Attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.',
    problemDescription: `You need to add logging, caching, and retry logic to a service. Subclassing creates an explosion: LoggingService, CachingService, RetryService, LoggingCachingService, LoggingRetryService... The combinations multiply. You want to mix and match behaviors freely.`,
    problemCode: `// Subclass explosion — one class per combination
class LoggingEmailService extends EmailService { ... }
class CachingEmailService extends EmailService { ... }
class LoggingCachingEmailService extends EmailService { ... }
// n behaviors = 2^n subclasses`,
    solutionDescription: `Each behavior becomes a Decorator that wraps the component. Decorators implement the same interface as the component. They delegate to the wrapped object and add behavior before or after the delegation.`,
    solutionDiagram: `TextMessage
     │ wrapped by
LoggingDecorator
     │ wrapped by
CachingDecorator
     │
client.send()
  → caching.send()
    → logging.send()
      → message.send()`,
    implementationCode: { java: `public interface MessageService {
    void send(String message);
}

// Base implementation
public class EmailService implements MessageService {
    public void send(String message) {
        System.out.println("Sending email: " + message);
    }
}

// Decorator base
public abstract class MessageDecorator implements MessageService {
    protected final MessageService wrapped;
    public MessageDecorator(MessageService wrapped) { this.wrapped = wrapped; }
}

// Concrete decorator
public class LoggingDecorator extends MessageDecorator {
    public LoggingDecorator(MessageService wrapped) { super(wrapped); }

    @Override
    public void send(String message) {
        System.out.println("[LOG] Sending: " + message);
        wrapped.send(message);
        System.out.println("[LOG] Sent successfully");
    }
}

// Compose at runtime
MessageService service = new LoggingDecorator(
    new CachingDecorator(
        new EmailService()
    )
);
service.send("Hello");` },
    useWhen: [
      'You need to add responsibilities to objects without affecting other objects',
      'Extension by subclassing is impractical due to a large number of combinations',
      'Behaviors should be composable and removable at runtime',
    ],
    avoidWhen: [
      'The order of decoration matters in complex ways that are hard to track',
      'Too many layers make debugging stack traces confusing',
    ],
    realWorld: [
      { name: 'Java I/O Streams', description: 'BufferedInputStream wraps FileInputStream — classic decorator chain.' },
      { name: 'Spring Security', description: 'Security filters decorate the HTTP request handling chain.' },
      { name: 'HttpServletRequestWrapper', description: 'Decorates an HTTP request to add or modify behavior.' },
    ],
    related: ['adapter', 'composite', 'strategy'],
    takeaways: [
      'Decorators add behavior without changing the original class.',
      'Each decorator does one thing — compose them for multiple behaviors.',
      'Order of decoration matters — the outermost executes first.',
      'Java I/O is the canonical example of Decorator in the standard library.',
    ],
    hasRepoCode: false,
  },

  'facade': {
    id: 'facade', name: 'Facade', category: 'structural', difficulty: 'beginner',
    readingTime: 6,
    summary: 'Provide a simplified interface to a complex subsystem.',
    intent: 'Provide a unified interface to a set of interfaces in a subsystem. Facade defines a higher-level interface that makes the subsystem easier to use.',
    problemDescription: `Starting a video file requires: decoding the video codec, loading the audio decoder, initializing the buffer, setting the rendering pipeline, and opening the display. The client must know all these subsystems and their correct initialization order.`,
    problemCode: `// Client must orchestrate 5+ subsystems
VideoDecoder decoder = new VideoDecoder();
AudioDecoder audio = new AudioDecoder();
Buffer buffer = new Buffer(4096);
RenderPipeline pipeline = new RenderPipeline(decoder, buffer);
Display display = new Display();
audio.initialize();
pipeline.connect(display);
decoder.load("video.mp4");
pipeline.play();`,
    solutionDescription: `A Facade class provides a single simple method that orchestrates all the subsystem calls. The client calls one method; the facade handles the complexity.`,
    solutionDiagram: `Client
  │
  ▼
VideoFacade
+ play(filename)
  │
  ├──► VideoDecoder.load()
  ├──► AudioDecoder.init()
  ├──► Buffer.allocate()
  ├──► RenderPipeline.connect()
  └──► Display.show()`,
    implementationCode: { java: `public class VideoPlayerFacade {
    private final VideoDecoder videoDecoder;
    private final AudioDecoder audioDecoder;
    private final Buffer buffer;
    private final RenderPipeline pipeline;
    private final Display display;

    public VideoPlayerFacade() {
        this.videoDecoder = new VideoDecoder();
        this.audioDecoder = new AudioDecoder();
        this.buffer = new Buffer(4096);
        this.pipeline = new RenderPipeline(videoDecoder, buffer);
        this.display = new Display();
    }

    public void play(String filename) {
        audioDecoder.initialize();
        pipeline.connect(display);
        videoDecoder.load(filename);
        pipeline.play();
    }

    public void stop() {
        pipeline.stop();
        display.clear();
    }
}

// Client — clean and simple
VideoPlayerFacade player = new VideoPlayerFacade();
player.play("movie.mp4");` },
    useWhen: [
      'You want a simple interface to a complex subsystem',
      'There are many dependencies between clients and implementation classes',
      'You want to layer your subsystems',
    ],
    avoidWhen: [
      'Clients need fine-grained control over the subsystem',
      'The facade becomes a "god object" that does everything',
    ],
    realWorld: [
      { name: 'SLF4J', description: 'A logging facade that hides Log4j, Logback, or JUL behind one API.' },
      { name: 'JDBC', description: 'Facades the complexity of database-specific drivers behind a standard API.' },
      { name: 'Service Layer', description: 'In a Spring app, the service layer facades the repository and domain model.' },
    ],
    related: ['adapter', 'singleton', 'mediator'],
    takeaways: [
      'Facade simplifies — clients don\'t need to know subsystem details.',
      'Subsystems remain usable directly when clients need full control.',
      'Facade doesn\'t prevent direct access — it just provides a shortcut.',
      'Common in layered architectures (service facades, API gateways).',
    ],
    hasRepoCode: false,
  },

  'composite': {
    id: 'composite', name: 'Composite', category: 'structural', difficulty: 'intermediate',
    readingTime: 8,
    summary: 'Compose objects into tree structures to represent part-whole hierarchies.',
    intent: 'Compose objects into tree structures to represent part-whole hierarchies. Composite lets clients treat individual objects and compositions of objects uniformly.',
    problemDescription: `You're building a file system. Files and directories both need to display their size and be listed. But a directory contains files AND other directories. Treating them differently in client code makes recursive operations awkward.`,
    problemCode: `// Different handling for files vs directories — error-prone recursion
void printSize(Object item) {
    if (item instanceof File) {
        System.out.println(((File) item).getSize());
    } else if (item instanceof Directory) {
        for (Object child : ((Directory) item).getChildren()) {
            printSize(child); // recursive type-checking
        }
    }
}`,
    solutionDescription: `Define a common Component interface that both leaves (files) and composites (directories) implement. Composite operations recurse automatically — the client just calls the same method on any node.`,
    solutionDiagram: `        Component (interface)
        + getSize(): long
        + display(indent)
             ▲
      ┌──────┴──────┐
    File          Directory
    + getSize()   + getSize()  ← sums children
    + display()   + display()  ← recurses
                  - children: List<Component>`,
    implementationCode: { java: `public interface FileSystemComponent {
    long getSize();
    void display(String indent);
}

public class File implements FileSystemComponent {
    private final String name;
    private final long size;

    public File(String name, long size) {
        this.name = name; this.size = size;
    }
    @Override public long getSize() { return size; }
    @Override public void display(String indent) {
        System.out.println(indent + name + " (" + size + " bytes)");
    }
}

public class Directory implements FileSystemComponent {
    private final String name;
    private final List<FileSystemComponent> children = new ArrayList<>();

    public Directory(String name) { this.name = name; }

    public void add(FileSystemComponent c) { children.add(c); }

    @Override public long getSize() {
        return children.stream().mapToLong(FileSystemComponent::getSize).sum();
    }
    @Override public void display(String indent) {
        System.out.println(indent + "[" + name + "]");
        children.forEach(c -> c.display(indent + "  "));
    }
}` },
    useWhen: [
      'You need to represent part-whole hierarchies of objects',
      'Clients should treat individual objects and groups uniformly',
      'You\'re building tree structures (menus, org charts, file systems)',
    ],
    avoidWhen: [
      'The tree structure is so heterogeneous that a common interface forces unnatural methods',
      'The hierarchy is fixed and never dynamic',
    ],
    realWorld: [
      { name: 'java.awt.Container', description: 'Container holds Components; itself extends Component — classic Composite.' },
      { name: 'XML/JSON Trees', description: 'XML elements and text nodes implement a common Node interface.' },
      { name: 'Spring MVC ViewGroup', description: 'Android\'s ViewGroup composes Views — itself a View.' },
    ],
    related: ['decorator', 'iterator', 'visitor'],
    takeaways: [
      'Clients treat leaves and composites identically through a common interface.',
      'Adding new component types requires no changes to existing code.',
      'Recursive traversal becomes natural and clean.',
      'The tradeoff: the common interface may force leaves to implement operations that don\'t apply to them.',
    ],
    hasRepoCode: false,
  },

  'proxy': {
    id: 'proxy', name: 'Proxy', category: 'structural', difficulty: 'intermediate',
    readingTime: 8,
    summary: 'Provide a surrogate or placeholder for another object to control access to it.',
    intent: 'Provide a surrogate or placeholder for another object to control access to it.',
    problemDescription: `Loading a large image from disk is slow. But if the image is on a page where it might never be scrolled into view, loading it eagerly wastes time and memory. You need to defer loading until the image is actually needed.`,
    problemCode: `// Eager loading — every image loads at startup
List<Image> gallery = new ArrayList<>();
gallery.add(new RealImage("photo1.jpg")); // loads from disk immediately
gallery.add(new RealImage("photo2.jpg")); // loads from disk immediately
// User might only look at photo1`,
    solutionDescription: `The Proxy implements the same interface as the real subject. It controls access — here a Virtual Proxy that defers creation of the real object until first use.`,
    solutionDiagram: `Client ──► Image (interface)
              ▲            ▲
        LazyImageProxy   RealImage
        - realImage      - data: byte[]
        + display()      + display()
           │
           └── creates RealImage on first display()`,
    implementationCode: { java: `public interface Image {
    void display();
}

public class RealImage implements Image {
    private final String filename;

    public RealImage(String filename) {
        this.filename = filename;
        loadFromDisk(); // expensive
    }

    private void loadFromDisk() {
        System.out.println("Loading " + filename + " from disk...");
    }

    @Override public void display() {
        System.out.println("Displaying " + filename);
    }
}

// Virtual Proxy — defers loading
public class LazyImageProxy implements Image {
    private final String filename;
    private RealImage realImage; // null until needed

    public LazyImageProxy(String filename) {
        this.filename = filename; // fast — no disk access
    }

    @Override
    public void display() {
        if (realImage == null) {
            realImage = new RealImage(filename); // load only on first call
        }
        realImage.display();
    }
}` },
    useWhen: [
      'Lazy initialization (virtual proxy) — defer expensive object creation',
      'Access control (protection proxy) — check permissions before delegating',
      'Logging/monitoring (logging proxy) — record calls transparently',
      'Caching (caching proxy) — return cached results when possible',
    ],
    avoidWhen: [
      'The overhead of the proxy layer exceeds the benefits',
      'Simple direct access is sufficient',
    ],
    realWorld: [
      { name: 'Spring AOP', description: 'Spring creates proxies around beans for @Transactional, @Cached, security.' },
      { name: 'Java Dynamic Proxy', description: 'java.lang.reflect.Proxy creates proxies at runtime for interfaces.' },
      { name: 'Hibernate Lazy Loading', description: 'Hibernate returns a proxy entity; the DB query runs on first field access.' },
    ],
    related: ['decorator', 'adapter', 'facade'],
    takeaways: [
      'Proxy and Decorator look similar — Proxy controls access, Decorator adds behavior.',
      'Virtual proxy defers creation; protection proxy controls who can access.',
      'Spring AOP relies heavily on dynamic proxies.',
      'The client doesn\'t know it\'s talking to a proxy.',
    ],
    hasRepoCode: false,
  },

  'bridge': {
    id: 'bridge', name: 'Bridge', category: 'structural', difficulty: 'advanced',
    readingTime: 10,
    summary: 'Decouple an abstraction from its implementation so the two can vary independently.',
    intent: 'Decouple an abstraction from its implementation so that the two can vary independently.',
    problemDescription: `You have shapes (Circle, Square) and renderers (VectorRenderer, RasterRenderer). Without Bridge, you need CircleVector, CircleRaster, SquareVector, SquareRaster — the class count multiplies with every new shape or renderer.`,
    problemCode: `// Class explosion: shapes × renderers
class VectorCircle extends Circle { ... }
class RasterCircle extends Circle { ... }
class VectorSquare extends Square { ... }
class RasterSquare extends Square { ... }
// Adding a Triangle requires 2 more classes. Adding PixelRenderer adds 2 more.`,
    solutionDescription: `Bridge separates the abstraction (shapes) from the implementation (renderers) into two independent hierarchies connected by a reference. Each side can be extended independently.`,
    solutionDiagram: `Shape (abstraction)            Renderer (implementation)
- renderer: Renderer           + renderCircle(radius)
+ draw()                       + renderSquare(side)
    ▲                                 ▲
Circle   Square             VectorRenderer  RasterRenderer`,
    implementationCode: { java: `public interface Renderer {
    void renderCircle(double radius);
    void renderSquare(double side);
}

public abstract class Shape {
    protected final Renderer renderer;
    public Shape(Renderer renderer) { this.renderer = renderer; }
    public abstract void draw();
}

public class Circle extends Shape {
    private final double radius;
    public Circle(double radius, Renderer renderer) {
        super(renderer); this.radius = radius;
    }
    @Override public void draw() { renderer.renderCircle(radius); }
}

public class VectorRenderer implements Renderer {
    @Override public void renderCircle(double r) {
        System.out.println("Drawing vector circle r=" + r);
    }
    @Override public void renderSquare(double s) {
        System.out.println("Drawing vector square s=" + s);
    }
}

// Combine freely at runtime
Shape circle = new Circle(5.0, new VectorRenderer());
Shape square = new Square(3.0, new RasterRenderer());` },
    useWhen: [
      'You want to avoid a permanent binding between abstraction and implementation',
      'Both abstraction and implementation should be extensible via subclassing',
      'Implementations should be switchable at runtime',
    ],
    avoidWhen: [
      'The abstraction and implementation won\'t need independent variation',
      'The indirection adds complexity without real benefit',
    ],
    realWorld: [
      { name: 'JDBC', description: 'The JDBC API is the abstraction; each database driver is the implementation.' },
      { name: 'java.util.logging', description: 'Handler (abstraction) works with various formatters (implementations).' },
    ],
    related: ['adapter', 'abstract-factory', 'strategy'],
    takeaways: [
      'Bridge solves the "cartesian product" class explosion problem.',
      'Abstraction and implementation can grow independently.',
      'Often confused with Adapter — Bridge is designed upfront, Adapter retrofits.',
      'Strategy is similar but focused on behavior; Bridge is focused on structure.',
    ],
    hasRepoCode: false,
  },

  /* ══════════════ BEHAVIORAL ══════════════ */

  'strategy': {
    id: 'strategy', name: 'Strategy', category: 'behavioral', difficulty: 'beginner',
    readingTime: 8,
    summary: 'Define a family of algorithms, encapsulate each one, and make them interchangeable at runtime.',
    intent: 'Define a family of algorithms, encapsulate each one, and make them interchangeable. Strategy lets the algorithm vary independently from clients that use it.',
    problemDescription: `A payment processor needs to support CreditCard, PayPal, and Crypto payments. Using if/else chains means every new payment type requires modifying the core class. Testing any payment method requires instantiating the whole processor.`,
    problemCode: `class PaymentProcessor {
    void processPayment(String type, double amount) {
        if (type.equals("CREDIT")) {
            // credit card logic — 30 lines
        } else if (type.equals("PAYPAL")) {
            // PayPal logic — 30 lines
        } else if (type.equals("CRYPTO")) {
            // crypto logic — 30 lines
        }
        // Adding a new type means editing this class
    }
}`,
    solutionDescription: `Extract each payment algorithm into its own class implementing a common interface. The PaymentProcessor holds a reference to the strategy interface and delegates to whichever concrete strategy is injected.`,
    solutionDiagram: `PaymentProcessor
- strategy: PaymentStrategy
+ setStrategy(PaymentStrategy)
+ process(amount)
        │ delegates to
        ▼
  PaymentStrategy (interface)
  + pay(amount)
    ▲         ▲         ▲
CreditCard  PayPal   Crypto`,
    implementationCode: { java: `// Strategy interface
public interface PaymentProcessor {
    void processPayment(double amount);
}

// Concrete strategies
public class CreditCardPayment implements PaymentProcessor {
    private final String cardNumber;
    public CreditCardPayment(String cardNumber) { this.cardNumber = cardNumber; }

    @Override
    public void processPayment(double amount) {
        System.out.println("Charging $" + amount + " to card " + cardNumber);
    }
}

public class PayPalPayment implements PaymentProcessor {
    private final String email;
    public PayPalPayment(String email) { this.email = email; }

    @Override
    public void processPayment(double amount) {
        System.out.println("PayPal charge $" + amount + " to " + email);
    }
}

// Context
public class Checkout {
    private PaymentProcessor strategy;

    public void setStrategy(PaymentProcessor strategy) {
        this.strategy = strategy;
    }

    public void complete(double amount) {
        strategy.processPayment(amount); // delegate
    }
}

// Usage — switch strategy at runtime
Checkout checkout = new Checkout();
checkout.setStrategy(new CreditCardPayment("4242-xxxx"));
checkout.complete(99.99);

checkout.setStrategy(new PayPalPayment("user@email.com"));
checkout.complete(49.99);` },
    useWhen: [
      'Multiple related classes differ only in behavior',
      'You need different variants of an algorithm',
      'A class defines many behaviors via conditional statements',
    ],
    avoidWhen: [
      'Only one or two algorithms exist and they\'re unlikely to change',
      'Clients must be aware of the different strategies — this creates unnecessary coupling',
    ],
    realWorld: [
      { name: 'Java Comparator', description: 'Collections.sort(list, comparator) accepts a strategy for comparison.' },
      { name: 'Spring Security', description: 'AuthenticationStrategy decides how authentication is handled.' },
      { name: 'Validator frameworks', description: 'Different validation rules are strategies applied to form fields.' },
    ],
    related: ['state', 'template-method', 'decorator'],
    takeaways: [
      'Replaces conditionals with polymorphism.',
      'Each strategy is independently testable.',
      'Strategies are swappable at runtime.',
      'In Java 8+, strategies can be lambdas if the interface has one method.',
    ],
    hasRepoCode: true,
    repoPath: 'src/main/java/org/patidar/behaviorPattern/strategyPattern/payment',
  },

  'observer': {
    id: 'observer', name: 'Observer', category: 'behavioral', difficulty: 'beginner',
    readingTime: 9,
    summary: 'Define a one-to-many dependency so that when one object changes state, all dependents are notified.',
    intent: 'Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.',
    problemDescription: `A weather station measures temperature. A phone app, a dashboard, and a TV display all need to show current temperature. Hard-coding the update calls inside the WeatherStation couples it to every display.`,
    problemCode: `class WeatherStation {
    private double temperature;

    void setTemperature(double temp) {
        this.temperature = temp;
        phoneApp.update(temp);     // direct reference — tight coupling
        dashboard.update(temp);   // must modify this class to add a new display
        tvDisplay.update(temp);
    }
}`,
    solutionDescription: `The subject (WeatherStation) maintains a list of observers. Any object implementing the Observer interface can subscribe. When state changes, the subject notifies all subscribers — with no knowledge of who they are.`,
    solutionDiagram: `WeatherStation (Subject)
- observers: List<Observer>
+ subscribe(Observer)
+ unsubscribe(Observer)
+ notifyAll()
       │ notifies
  ┌────┴────┬─────────┐
PhoneApp  Dashboard  TVDisplay
update()  update()   update()`,
    implementationCode: { java: `public interface WeatherObserver {
    void onTemperatureChange(double temperature);
}

public class WeatherStation {
    private final List<WeatherObserver> observers = new ArrayList<>();
    private double temperature;

    public void subscribe(WeatherObserver observer) {
        observers.add(observer);
    }
    public void unsubscribe(WeatherObserver observer) {
        observers.remove(observer);
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
        notifyObservers();
    }

    private void notifyObservers() {
        observers.forEach(o -> o.onTemperatureChange(temperature));
    }
}

public class PhoneApp implements WeatherObserver {
    @Override
    public void onTemperatureChange(double temperature) {
        System.out.println("Phone: Temp is now " + temperature + "°C");
    }
}

// Usage
WeatherStation station = new WeatherStation();
station.subscribe(new PhoneApp());
station.subscribe(new Dashboard());
station.setTemperature(23.5); // both observers notified` },
    useWhen: [
      'A change in one object requires updating others, and you don\'t know how many',
      'Objects should be able to notify other objects without assumptions about who they are',
      'Event-driven systems where publishers and subscribers are decoupled',
    ],
    avoidWhen: [
      'Notification chains become too deep and debugging becomes hard',
      'Update order among observers matters but is hard to guarantee',
    ],
    realWorld: [
      { name: 'Java EventListener', description: 'Swing\'s ActionListener, MouseListener are Observer pattern.' },
      { name: 'RxJava / Project Reactor', description: 'Reactive streams are Observer taken to its logical extreme.' },
      { name: 'Spring ApplicationEvent', description: 'Spring\'s event publishing system uses Observer internally.' },
    ],
    related: ['strategy', 'mediator', 'chain-of-responsibility'],
    takeaways: [
      'Subject and observers are loosely coupled — subject knows only the interface.',
      'Adding a new observer requires no changes to the subject.',
      'Unexpected updates can cascade — be careful with circular dependencies.',
      'Java\'s java.util.Observable is deprecated in Java 9; use custom implementation.',
    ],
    hasRepoCode: false,
  },

  'command': {
    id: 'command', name: 'Command', category: 'behavioral', difficulty: 'intermediate',
    readingTime: 9,
    summary: 'Encapsulate a request as an object, allowing parameterization, queuing, and undo.',
    intent: 'Encapsulate a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undoable operations.',
    problemDescription: `A text editor needs an undo/redo system. Every operation (type, delete, format) needs to be reversible. Storing the raw method calls doesn't capture enough information to undo them.`,
    problemCode: `class TextEditor {
    void type(String text) { ... }
    void delete(int count) { ... }
    void bold() { ... }
    // How do you undo these? No history, no context.
}`,
    solutionDescription: `Each action becomes a Command object that knows how to execute AND undo itself. The editor maintains a command history stack. Undo pops and reverses the last command.`,
    solutionDiagram: `Invoker (Editor)          Command (interface)
- history: Deque<Command>   + execute()
+ execute(Command)          + undo()
+ undo()                        ▲
                         TypeCommand  DeleteCommand
                         - text       - deleted text
                         + execute()  + execute()
                         + undo()     + undo()`,
    implementationCode: { java: `public interface Command {
    void execute();
    void undo();
}

public class TypeCommand implements Command {
    private final StringBuilder document;
    private final String text;

    public TypeCommand(StringBuilder document, String text) {
        this.document = document; this.text = text;
    }

    @Override public void execute() { document.append(text); }
    @Override public void undo() { document.delete(document.length() - text.length(), document.length()); }
}

public class TextEditor {
    private final StringBuilder document = new StringBuilder();
    private final Deque<Command> history = new ArrayDeque<>();

    public void execute(Command command) {
        command.execute();
        history.push(command);
    }

    public void undo() {
        if (!history.isEmpty()) {
            history.pop().undo();
        }
    }

    public String getText() { return document.toString(); }
}

// Usage
TextEditor editor = new TextEditor();
editor.execute(new TypeCommand(editor.document, "Hello"));
editor.execute(new TypeCommand(editor.document, " World"));
System.out.println(editor.getText()); // "Hello World"
editor.undo();
System.out.println(editor.getText()); // "Hello"` },
    useWhen: [
      'Undo/redo functionality is required',
      'You want to queue operations and execute them later',
      'You need to log or audit all operations',
      'You want to support transactional behavior (execute/rollback)',
    ],
    avoidWhen: [
      'Simple one-off actions that never need undoing',
      'The command hierarchy becomes too deep',
    ],
    realWorld: [
      { name: 'java.lang.Runnable', description: 'Runnable encapsulates a unit of work to be executed by a thread.' },
      { name: 'Database Transactions', description: 'SQL commands are queued and committed or rolled back as a unit.' },
      { name: 'Git commits', description: 'Each commit is a command that can be reversed with git revert.' },
    ],
    related: ['observer', 'strategy', 'memento'],
    takeaways: [
      'Command turns a method call into an object — it can be stored, queued, logged.',
      'Undo/redo is implemented by maintaining a history stack of commands.',
      'Macro commands compose multiple commands into one.',
      'Runnable/Callable in Java are lightweight versions of Command.',
    ],
    hasRepoCode: false,
  },

  'state': {
    id: 'state', name: 'State', category: 'behavioral', difficulty: 'intermediate',
    readingTime: 9,
    summary: 'Allow an object to alter its behavior when its internal state changes.',
    intent: 'Allow an object to alter its behavior when its internal state changes. The object will appear to change its class.',
    problemDescription: `A vending machine behaves differently depending on whether it has coins inserted, is out of stock, or is dispensing. Massive switch/if-else statements for every state make the code fragile and hard to extend.`,
    problemCode: `class VendingMachine {
    static final int IDLE = 0, HAS_COIN = 1, DISPENSING = 2;
    int state = IDLE;

    void insertCoin() {
        if (state == IDLE) { state = HAS_COIN; }
        else if (state == HAS_COIN) { System.out.println("Already has coin"); }
        // grows with every new state
    }
}`,
    solutionDescription: `Each state becomes its own class implementing a State interface. The context delegates behavior to the current state object. State transitions happen by replacing the current state object.`,
    solutionDiagram: `VendingMachine (Context)
- state: VendingState
+ insertCoin()  ──► state.insertCoin()
+ pressButton() ──► state.pressButton()

     VendingState (interface)
           ▲
    ┌──────┴───────┐
  IdleState   HasCoinState   DispensingState`,
    implementationCode: { java: `public interface VendingState {
    void insertCoin(VendingMachine machine);
    void pressButton(VendingMachine machine);
}

public class IdleState implements VendingState {
    @Override
    public void insertCoin(VendingMachine machine) {
        System.out.println("Coin inserted");
        machine.setState(new HasCoinState());
    }
    @Override
    public void pressButton(VendingMachine machine) {
        System.out.println("Insert coin first");
    }
}

public class HasCoinState implements VendingState {
    @Override
    public void insertCoin(VendingMachine machine) {
        System.out.println("Already has a coin");
    }
    @Override
    public void pressButton(VendingMachine machine) {
        System.out.println("Dispensing item...");
        machine.setState(new IdleState());
    }
}

public class VendingMachine {
    private VendingState state = new IdleState();
    public void setState(VendingState s) { this.state = s; }
    public void insertCoin()  { state.insertCoin(this); }
    public void pressButton() { state.pressButton(this); }
}` },
    useWhen: [
      'An object\'s behavior depends on its state and must change at runtime',
      'Large conditional statements based on the object\'s state',
      'State transitions are complex and need to be explicit',
    ],
    avoidWhen: [
      'Very few states that are simple and unlikely to change',
      'Overhead of many small state classes outweighs the benefit',
    ],
    realWorld: [
      { name: 'Order Workflow', description: 'PENDING → CONFIRMED → SHIPPED → DELIVERED each have different behaviors.' },
      { name: 'TCP Connection', description: 'LISTENING, SYN_RECEIVED, ESTABLISHED, etc. each respond differently.' },
      { name: 'UI Components', description: 'A button can be in NORMAL, HOVERED, PRESSED, DISABLED states.' },
    ],
    related: ['strategy', 'observer', 'command'],
    takeaways: [
      'State eliminates large conditional statements.',
      'State transitions are explicit and visible.',
      'Each state class is independently testable.',
      'State looks like Strategy — but strategies are interchangeable; states are internal and transition each other.',
    ],
    hasRepoCode: false,
  },

  'template-method': {
    id: 'template-method', name: 'Template Method', category: 'behavioral', difficulty: 'beginner',
    readingTime: 7,
    summary: 'Define the skeleton of an algorithm in a base class, deferring some steps to subclasses.',
    intent: 'Define the skeleton of an algorithm in an operation, deferring some steps to subclasses. Template Method lets subclasses redefine certain steps without changing the algorithm\'s structure.',
    problemDescription: `You're building data exporters for CSV, JSON, and XML. All exporters follow the same process: open the connection, read data, format data, write output, close connection. Only the "format data" step differs. Copy-pasting the surrounding logic into each class duplicates code.`,
    problemCode: `class CsvExporter {
    void export() {
        openConnection(); // duplicated
        List<Row> data = readData(); // duplicated
        String csv = formatAsCsv(data); // varies
        writeOutput(csv); // duplicated
        closeConnection(); // duplicated
    }
}
// JsonExporter and XmlExporter repeat the same skeleton`,
    solutionDescription: `The base class defines the overall algorithm as a final method, calling abstract "hook" methods for the steps that vary. Subclasses implement only the parts that differ.`,
    solutionDiagram: `DataExporter (abstract)
+ export() ← final — the template
  │
  ├── openConnection()
  ├── readData()
  ├── format(data)   ← abstract hook
  ├── writeOutput()
  └── closeConnection()
         ▲
  CsvExporter   JsonExporter   XmlExporter
  + format()    + format()     + format()`,
    implementationCode: { java: `public abstract class DataExporter {

    // Template method — defines the algorithm skeleton
    public final void export() {
        openConnection();
        List<Row> data = readData();
        String formatted = format(data);  // hook
        writeOutput(formatted);
        closeConnection();
    }

    private void openConnection()  { System.out.println("Opening connection..."); }
    private List<Row> readData()   { return fetchFromDatabase(); }
    private void writeOutput(String s) { System.out.println("Writing: " + s); }
    private void closeConnection() { System.out.println("Closing connection..."); }

    // Hook method — subclasses override this
    protected abstract String format(List<Row> data);
}

public class CsvExporter extends DataExporter {
    @Override
    protected String format(List<Row> data) {
        return data.stream()
            .map(Row::toCsvLine)
            .collect(Collectors.joining("\n"));
    }
}

public class JsonExporter extends DataExporter {
    @Override
    protected String format(List<Row> data) {
        return new Gson().toJson(data);
    }
}` },
    useWhen: [
      'Multiple classes share the same algorithm structure but differ in certain steps',
      'Common behavior should be factored into a superclass to avoid duplication',
      'You want to control which parts of an algorithm subclasses can override',
    ],
    avoidWhen: [
      'The invariant and variable parts are hard to cleanly separate',
      'Inheritance becomes too deep, making the code hard to follow',
    ],
    realWorld: [
      { name: 'AbstractList', description: 'Provides a complete List implementation; subclasses implement get() and size().' },
      { name: 'HttpServlet', description: 'doGet/doPost are hooks; the dispatch logic is the template.' },
      { name: 'JUnit', description: 'setUp/tearDown are hooks within the test execution template.' },
    ],
    related: ['strategy', 'factory-method'],
    takeaways: [
      'Inverts control — the base class calls the subclass, not the other way.',
      'The template method should be final to prevent accidental override.',
      'Strategy provides the same variation via composition; Template Method uses inheritance.',
      'Good for framework design — define the skeleton, let users fill in the blanks.',
    ],
    hasRepoCode: false,
  },

  'chain-of-responsibility': {
    id: 'chain-of-responsibility', name: 'Chain of Responsibility', category: 'behavioral', difficulty: 'intermediate',
    readingTime: 8,
    summary: 'Pass requests along a chain of handlers until one handles it.',
    intent: 'Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle the request. Chain the receiving objects and pass the request along the chain.',
    problemDescription: `An HTTP request needs authentication, logging, rate limiting, and routing — in order. Hard-wiring all these checks into one class creates a monolithic, untestable handler that's hard to reorder or extend.`,
    problemCode: `class RequestHandler {
    void handle(Request req) {
        // 200 lines of authentication + logging + rate limiting + routing
        // all interleaved — impossible to test or reorder
    }
}`,
    solutionDescription: `Each check becomes a Handler. Each handler either processes the request and stops the chain, or passes it to the next handler. The chain is assembled at startup.`,
    solutionDiagram: `Request ──► AuthHandler ──► LoggingHandler ──► RateLimitHandler ──► RouteHandler
                  │               │                  │                   │
               handles?        handles?           handles?            handles it`,
    implementationCode: { java: `public abstract class RequestHandler {
    private RequestHandler next;

    public RequestHandler setNext(RequestHandler next) {
        this.next = next;
        return next; // enables chaining: a.setNext(b).setNext(c)
    }

    public void handle(Request request) {
        if (next != null) next.handle(request);
    }
}

public class AuthHandler extends RequestHandler {
    @Override
    public void handle(Request request) {
        if (!request.hasValidToken()) {
            System.out.println("Unauthorized — stopping chain");
            return; // stop chain
        }
        System.out.println("Auth passed");
        super.handle(request); // pass to next
    }
}

public class LoggingHandler extends RequestHandler {
    @Override
    public void handle(Request request) {
        System.out.println("LOG: " + request.getPath());
        super.handle(request); // always pass along
    }
}

// Assemble the chain
RequestHandler auth    = new AuthHandler();
RequestHandler logging = new LoggingHandler();
RequestHandler router  = new RouteHandler();

auth.setNext(logging).setNext(router);
auth.handle(new Request("/api/users", token));` },
    useWhen: [
      'More than one object may handle a request and the handler is not known a priori',
      'You want to issue a request to one of several objects without specifying which explicitly',
      'The set of objects that can handle a request should be specified dynamically',
    ],
    avoidWhen: [
      'Request handling order must be guaranteed — chain order depends on assembly',
      'No handler will process the request — the request is silently dropped',
    ],
    realWorld: [
      { name: 'Servlet Filters', description: 'Java EE filter chain is Chain of Responsibility.' },
      { name: 'Spring Security Filters', description: 'SecurityFilterChain processes each request through ordered filters.' },
      { name: 'Exception handling', description: 'try/catch blocks form a chain: inner catches first, outer if unhandled.' },
    ],
    related: ['observer', 'command', 'decorator'],
    takeaways: [
      'Decouples sender from receiver — sender doesn\'t know which handler processes the request.',
      'Handlers can be added, removed, or reordered without changing senders.',
      'A request might go unhandled — add a default handler at the end of the chain.',
      'Servlet/Spring filter chains are the most common real-world example.',
    ],
    hasRepoCode: false,
  },

  'iterator': {
    id: 'iterator', name: 'Iterator', category: 'behavioral', difficulty: 'beginner',
    readingTime: 6,
    summary: 'Provide a way to access elements of a collection sequentially without exposing its representation.',
    intent: 'Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.',
    problemDescription: `You have a playlist that can be stored as an array, a linked list, or a tree (for album hierarchies). Client code that traverses it must know the internal structure — and breaks when you change it.`,
    problemCode: `// Client must know the internal structure
Playlist playlist = new ArrayPlaylist();
for (int i = 0; i < playlist.array.length; i++) { // exposes array
    play(playlist.array[i]);
}
// Switch to LinkedListPlaylist — all traversal code breaks`,
    solutionDescription: `The collection exposes an iterator object that handles traversal. The client only uses hasNext() and next() — it never sees the internal structure.`,
    solutionDiagram: `Iterable (interface)        Iterator (interface)
+ iterator(): Iterator      + hasNext(): boolean
       ▲                    + next(): T
   Playlist                      ▲
   + iterator()          PlaylistIterator`,
    implementationCode: { java: `public class Playlist implements Iterable<Song> {
    private final List<Song> songs = new ArrayList<>();

    public void add(Song song) { songs.add(song); }

    @Override
    public Iterator<Song> iterator() {
        return songs.iterator(); // delegates to List's iterator
    }
}

// Custom iterator example
public class ReversePlaylistIterator implements Iterator<Song> {
    private final List<Song> songs;
    private int index;

    public ReversePlaylistIterator(List<Song> songs) {
        this.songs = songs;
        this.index = songs.size() - 1;
    }

    @Override public boolean hasNext() { return index >= 0; }
    @Override public Song next() { return songs.get(index--); }
}

// Client — doesn't care about internal structure
Playlist playlist = new Playlist();
for (Song song : playlist) {  // uses iterator implicitly
    song.play();
}` },
    useWhen: [
      'You need a uniform way to traverse different types of collections',
      'You want to hide the internal structure of a collection',
      'You need multiple independent traversals of the same collection',
    ],
    avoidWhen: [
      'The collection is trivially simple and always the same data structure',
      'Using a simple for loop over a concrete list is sufficient',
    ],
    realWorld: [
      { name: 'java.util.Iterator', description: 'Every Java collection implements Iterable and returns an Iterator.' },
      { name: 'for-each loop', description: 'Java\'s enhanced for loop uses Iterator under the hood.' },
      { name: 'Stream API', description: 'Java 8 Streams provide a lazy, functional iterator over collections.' },
    ],
    related: ['composite', 'factory-method', 'visitor'],
    takeaways: [
      'Iterator is baked into Java — every Collection implements Iterable.',
      'It decouples traversal logic from the collection\'s storage structure.',
      'Multiple iterators over the same collection can be active independently.',
      'Java Streams are a modern, functional evolution of Iterator.',
    ],
    hasRepoCode: false,
  },

  'mediator': {
    id: 'mediator', name: 'Mediator', category: 'behavioral', difficulty: 'intermediate',
    readingTime: 8,
    summary: 'Define an object that encapsulates how a set of objects interact.',
    intent: 'Define an object that encapsulates how a set of objects interact. Mediator promotes loose coupling by keeping objects from referring to each other explicitly.',
    problemDescription: `In a UI form, checkboxes enable/disable fields, dropdowns affect other dropdowns, buttons validate and submit. Every UI element holds references to every other element it affects. Changing any element means updating all its references.`,
    problemCode: `class SubmitButton {
    private CheckBox terms;
    private TextField email;
    private Dropdown country;
    // References to every component it interacts with
    void onClick() {
        if (terms.isChecked() && email.isValid() && country.hasSelection()) { ... }
    }
    // Adding a new field means updating SubmitButton, and every other component`,
    solutionDescription: `A mediator object holds references to all components. Each component only knows the mediator. When something changes, it tells the mediator; the mediator decides what else needs updating.`,
    solutionDiagram: `           FormMediator
          ┌──────┬──────┐
          │      │      │
     CheckBox  TextField  Dropdown  Button
     notifies mediator
               mediator updates others`,
    implementationCode: { java: `public interface FormMediator {
    void componentChanged(FormComponent component);
}

public abstract class FormComponent {
    protected FormMediator mediator;
    public FormComponent(FormMediator mediator) { this.mediator = mediator; }
    public void changed() { mediator.componentChanged(this); }
}

public class SignupForm implements FormMediator {
    private CheckBox termsCheckBox;
    private Button submitButton;
    private TextField emailField;

    // Wire components
    public void setComponents(CheckBox cb, Button btn, TextField tf) {
        this.termsCheckBox = cb;
        this.submitButton = btn;
        this.emailField = tf;
    }

    @Override
    public void componentChanged(FormComponent component) {
        if (component == termsCheckBox) {
            submitButton.setEnabled(
                termsCheckBox.isChecked() && emailField.isValid()
            );
        } else if (component == emailField) {
            submitButton.setEnabled(
                termsCheckBox.isChecked() && emailField.isValid()
            );
        }
    }
}` },
    useWhen: [
      'Many objects communicate in well-defined but complex ways',
      'Reusing objects is difficult because they depend on too many others',
      'Behavior distributed across many classes should be centralized',
    ],
    avoidWhen: [
      'The mediator itself becomes a "god object" handling all logic',
      'Components have minimal interaction — direct references are simpler',
    ],
    realWorld: [
      { name: 'Air Traffic Control', description: 'Planes (components) communicate through the tower (mediator), not each other.' },
      { name: 'Message Broker', description: 'Kafka/RabbitMQ mediate messages between producers and consumers.' },
      { name: 'MVC Controller', description: 'The Controller mediates between View and Model.' },
    ],
    related: ['observer', 'facade', 'command'],
    takeaways: [
      'Centralized coordination reduces coupling between components.',
      'Components communicate through the mediator, not directly.',
      'Risk: the mediator can grow into a god object — keep it focused.',
      'Message brokers and event buses are distributed Mediators.',
    ],
    hasRepoCode: false,
  },

  'memento': {
    id: 'memento', name: 'Memento', category: 'behavioral', difficulty: 'intermediate',
    readingTime: 7,
    summary: 'Capture and restore an object\'s internal state without violating encapsulation.',
    intent: 'Without violating encapsulation, capture and externalize an object\'s internal state so that the object can be restored to this state later.',
    problemDescription: `You need a save/restore (undo) system for an editor. The naive approach of exposing all internal fields via getters violates encapsulation and makes the state hard to manage as complexity grows.`,
    problemCode: `// Must expose internals to save/restore state
class Editor {
    String text;          // exposed — breaks encapsulation
    int cursorPosition;   // exposed
    List<String> history; // exposed

    void saveState() {
        // Caller accesses raw fields — tightly coupled to internals
    }
}`,
    solutionDescription: `The Memento is an opaque object that captures the originator's internal state. Only the originator can create and read a memento. The caretaker stores mementos without ever looking inside them.`,
    solutionDiagram: `Editor (Originator)
+ save(): Memento      ← creates snapshot
+ restore(Memento)     ← restores from snapshot
       │
  EditorMemento        History (Caretaker)
  - text: String       - stack: Deque<Memento>
  - cursor: int        + push(Memento)
  (opaque to others)   + pop(): Memento`,
    implementationCode: { java: `public class Editor {
    private String text = "";
    private int cursor = 0;

    public void type(String s) { text += s; cursor = text.length(); }

    // Save state
    public EditorMemento save() {
        return new EditorMemento(text, cursor);
    }
    // Restore state
    public void restore(EditorMemento memento) {
        this.text   = memento.getText();
        this.cursor = memento.getCursor();
    }

    // Memento — only readable by Editor
    public static final class EditorMemento {
        private final String text;
        private final int cursor;
        private EditorMemento(String text, int cursor) {
            this.text = text; this.cursor = cursor;
        }
        private String getText()  { return text; }
        private int    getCursor() { return cursor; }
    }
}

// Caretaker
Deque<Editor.EditorMemento> history = new ArrayDeque<>();
Editor editor = new Editor();

editor.type("Hello");
history.push(editor.save());   // save snapshot
editor.type(" World");
history.push(editor.save());

editor.restore(history.pop()); // undo
editor.restore(history.pop()); // undo again` },
    useWhen: [
      'You need to implement undo/redo or snapshot/restore',
      'Directly accessing state would expose implementation details',
      'Object state must be saved without coupling the saver to the object\'s internals',
    ],
    avoidWhen: [
      'State is very large — storing snapshots is expensive',
      'Clients need to inspect what\'s in the saved state',
    ],
    realWorld: [
      { name: 'Ctrl+Z / Undo', description: 'All undo systems from games to IDEs use some form of Memento.' },
      { name: 'Database Savepoints', description: 'SAVEPOINT in SQL captures state for partial rollback.' },
      { name: 'Git stash', description: 'git stash captures working state as a memento to restore later.' },
    ],
    related: ['command', 'iterator', 'state'],
    takeaways: [
      'Encapsulation is preserved — only the originator reads its own mementos.',
      'The caretaker stores mementos but cannot read inside them.',
      'For large objects, consider incremental mementos (only store the delta).',
      'Command + Memento together implement undo/redo robustly.',
    ],
    hasRepoCode: false,
  },

  'visitor': {
    id: 'visitor', name: 'Visitor', category: 'behavioral', difficulty: 'advanced',
    readingTime: 10,
    summary: 'Add new operations to an object structure without modifying the objects.',
    intent: 'Represent an operation to be performed on elements of an object structure. Visitor lets you define a new operation without changing the classes of the elements on which it operates.',
    problemDescription: `You have a document object model: Paragraph, Image, Table, Heading. Now you need export-to-HTML, export-to-Markdown, and spell-check. Adding each operation directly to all node classes keeps modifying them and bloats the model.`,
    problemCode: `class Paragraph {
    void exportToHtml()     { ... } // mixed in with document model
    void exportToMarkdown() { ... } // more mixed-in concerns
    void spellCheck()       { ... } // keeps growing
}
// Adding PDF export means editing EVERY node class again`,
    solutionDescription: `Each operation becomes a Visitor. Elements have an accept(Visitor) method that double-dispatches to the right visitor method. New operations are new visitor classes — no element changes.`,
    solutionDiagram: `    DocumentNode (interface)
    + accept(Visitor)
           ▲
  Paragraph  Image  Table     Visitor (interface)
  + accept() + accept()      + visit(Paragraph)
                              + visit(Image)
                              + visit(Table)
                                   ▲
                         HtmlExporter  MarkdownExporter`,
    implementationCode: { java: `public interface DocumentVisitor {
    void visit(Paragraph paragraph);
    void visit(Image image);
    void visit(Table table);
}

public interface DocumentNode {
    void accept(DocumentVisitor visitor);
}

public class Paragraph implements DocumentNode {
    private final String text;
    public Paragraph(String text) { this.text = text; }
    public String getText() { return text; }

    @Override public void accept(DocumentVisitor visitor) {
        visitor.visit(this); // double dispatch
    }
}

public class HtmlExporter implements DocumentVisitor {
    private final StringBuilder output = new StringBuilder();

    @Override public void visit(Paragraph p) {
        output.append("<p>").append(p.getText()).append("</p>\n");
    }
    @Override public void visit(Image img) {
        output.append("<img src='").append(img.getSrc()).append("'/>\n");
    }
    @Override public void visit(Table t) {
        output.append("<table>").append(t.renderHtml()).append("</table>\n");
    }

    public String getOutput() { return output.toString(); }
}

// Usage
List<DocumentNode> nodes = List.of(new Paragraph("Hello"), new Image("img.png"));
HtmlExporter exporter = new HtmlExporter();
nodes.forEach(n -> n.accept(exporter));
System.out.println(exporter.getOutput());` },
    useWhen: [
      'You need to perform many distinct and unrelated operations on an object structure',
      'Adding new operations is frequent but the object structure changes rarely',
      'You want to gather related operations into one class rather than scattering them',
    ],
    avoidWhen: [
      'The object hierarchy changes frequently — adding a new node type requires updating all visitors',
      'The operations are closely related to the objects themselves',
    ],
    realWorld: [
      { name: 'Compiler AST', description: 'Compilers use visitors for type checking, code gen, and optimization on the AST.' },
      { name: 'javax.lang.model', description: 'Java\'s annotation processing uses ElementVisitor for AST traversal.' },
      { name: 'ObjectMapper', description: 'Jackson\'s serializers use a visitor-like traversal over the object graph.' },
    ],
    related: ['composite', 'iterator', 'command'],
    takeaways: [
      'Visitor adds new operations without touching existing element classes.',
      'Double dispatch: element calls visitor.visit(this), selecting the right overload.',
      'Tradeoff: adding new element types requires updating every visitor.',
      'Best when operations are numerous and elements are stable.',
    ],
    hasRepoCode: false,
  },

};

/* ── Ordered list ────────────────────────────────────────── */

const PATTERN_ORDER = [
  'singleton','factory-method','abstract-factory','builder','prototype',
  'adapter','decorator','facade','composite','proxy','bridge',
  'strategy','observer','command','state','template-method',
  'chain-of-responsibility','iterator','mediator','memento','visitor',
];

const CATEGORIES = {
  creational: { label: 'Creational', color: '#8b5cf6', desc: 'Deal with object creation mechanisms.' },
  structural:  { label: 'Structural',  color: '#0ea5e9', desc: 'Deal with object composition and relationships.' },
  behavioral:  { label: 'Behavioral',  color: '#10b981', desc: 'Deal with algorithms and assignment of responsibilities.' },
};

const DIFFICULTIES = {
  beginner:     { label: 'Beginner',     color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced:     { label: 'Advanced',     color: '#ef4444' },
};
