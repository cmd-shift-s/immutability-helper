const update = require("./");

describe("update", () => {
  describe("has a #$set method that", () => {
    var state;
    var commands;
    var nextState;
    beforeEach(() => {
      state = {
        a: {
          b: 22,
          c: 33
        },
        unChanged: {}
      };
      commands = { a: { c: { $set: 44 } } };
      nextState = update(state, commands);
    });

    it("changes the tree on the directive", () => {
      expect(state.a.c).not.toBe(nextState.a.c);
    });

    it("reuses state on different branches", () => {
      expect(state.unChanged).toBe(nextState.unChanged);
    });

    it('should pass', () => {
      const state = { name: "Alice", todos: [] };
      const nextState = update(state, {
        name: { $set: "Bob" }
      });

      expect(nextState.name).toBe("Bob")
      expect(state.todos).toBe(nextState.todos)
    })
  });

  describe("throws error", () => {
    it("should throw 'not found command' error", () => {
      expect(() => {
        update({a: "b"}, {$boom: {}})
      }).toThrowError("Not Found command: $boom")
    })

    it("should throw 'invalid argument' error", () => {
      expect(() => {
        update(2, {$apply: 4})
      }).toThrowError("Invalid argument: '$apply'는 함수만 받을 수 있습니다.")
    })
  })

  describe("can pass react's test suite", () => {
    it("should support set", () => {
      expect(update({ a: "b" }, { $set: { c: "d" } })).toEqual({ c: "d" });
    });

    it("should support push", () => {
      expect(update([1], { $push: [7] })).toEqual([1, 7]);
    });

    it("should support unshift", () => {
      expect(update([1], { $unshift: [7] })).toEqual([7, 1]);
    });

    it("should support merge", () => {
      expect(update({ a: "b" }, { $merge: { c: "d" } })).toEqual({
        a: "b",
        c: "d"
      });
    });

    it("should support apply", () => {
      expect(
        update(2, {
          $apply: function(x) {
            return x * 2;
          }
        })
      ).toBe(4);
    });

    it("should support deep updates", () => {
      expect(
        update({ a: "b", c: { d: "e" } }, { c: { d: { $set: "f" } } })
      ).toEqual({
        a: "b",
        c: { d: "f" }
      });
    });

    it("should support splice", () => {
      expect(update([1, 4, 3], { $splice: [[1, 1, 2]] })).toEqual([1, 2, 3]);
    });
  });
});
